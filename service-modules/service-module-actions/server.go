package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/segmentio/kafka-go"
	"google.golang.org/grpc"
	"log"
	"math/rand"
	"net"
	"os"
	"service-module-actions/v2/actions"
	"strconv"
	"sync"
	"time"
)

// A module representation
type Module struct {
	Id             int
	Type			string
	DetachAltitude int
	MaxPressure    float32
	MinFuelToLand  float32
	LastMetric     Metric
}

// A simple metric for telemetry
type Metric struct {
	Timestamp  time.Time `json:"timestamp"`
	IdModule   int       `json:"idModule"`
	Altitude   int       `json:"altitude"`
	Fuel       float32   `json:"fuel"`
	Pressure   float32   `json:"pressure"`
	Speed      int       `json:"speed"`
	Latitude   float32   `json:"latitude"`
	Longitude  float32   `json:"longitude"`
	IsAttached bool      `json:"isAttached"`
	IsRunning  bool      `json:"isRunning"`
	IsBoom     bool      `json:"isBoom"`
	HasLanded  bool		  `json:"hasLanded"`
}

// A event representation
type Event struct {
	Timestamp   time.Time `json:"timestamp"`
	IdModule    int       `json:"idModule"`
	Label       string    `json:"label"`
	Initiator   string    `json:"initiator"`
	Description string    `json:"description"`
	RocketId 	int		  `json:"rocketId"`
}

const TopicRocketEvent = "topic-rocket-event"
const ModuleTypeBooster = "booster"
const ModuleTypePayload = "payload"
const ModuleTypeMiddle = "middle"

var AnalogFile *os.File
var mu sync.Mutex   // Its mutex for read / write analog
var CurrentModule Module

var fuelCanLower = false

var kafkaCon *kafka.Conn

var rocketId = -1
var LINEAR_FACTOR = 10 // Linear factor <=> acceleration and altitudeVariation value
var PRESSURE_FACTOR = float32(20.0) // Factor between speed and pressure

var MAX_SPEED = 150 // Max speed of the rocket
var AltitudeToStartPower = 0

func createNewMetric() {
	// Generation from last metric

	// Altitude variation

	var altitudeVariation = 0
	if CurrentModule.LastMetric.Fuel > CurrentModule.MinFuelToLand {
		altitudeVariation = CurrentModule.LastMetric.Speed/3
		// If not running, altitude decreases instead of increasing
		//if !(CurrentModule.LastMetric.IsRunning || CurrentModule.LastMetric.Fuel > 0) {
		//	//altitudeVariation = -altitudeVariation
		//	// Avoid negative altitude
		//	if CurrentModule.LastMetric.Altitude + altitudeVariation < 0 {
		//		altitudeVariation = -CurrentModule.LastMetric.Altitude
		//	}
		//}
	} else {
		if CurrentModule.LastMetric.Altitude > 200 {
			altitudeVariation =  -CurrentModule.LastMetric.Speed
		} else {
			altitudeVariation =  -CurrentModule.LastMetric.Speed/2
		}
		log.Println("Altitude variation : ", altitudeVariation)
	}
	if CurrentModule.LastMetric.Altitude + altitudeVariation < 0{
		altitudeVariation = 0
		CurrentModule.LastMetric.Altitude = 0
	}

	// We decrease fuel only if the module is running
	var fuelVariation = float32(0.0)
	if fuelCanLower {
		if CurrentModule.LastMetric.IsRunning {
			if CurrentModule.LastMetric.IsAttached {
				fuelVariation = -20
			}else{
				if CurrentModule.LastMetric.Altitude > 200 {
					fuelVariation = -2
				} else {
					fuelVariation = -4
				}
			}
		}
		if CurrentModule.LastMetric.Fuel+fuelVariation < 0 {
			fuelVariation =  CurrentModule.LastMetric.Fuel + fuelVariation + (-fuelVariation - CurrentModule.LastMetric.Fuel)
		}
	}

	// Pressure according to speed
	newPressure := 1.0+float32(CurrentModule.LastMetric.Speed)/PRESSURE_FACTOR

	// Speed variation: acceleration is 0 when not running
	acceleration := 0
	if CurrentModule.LastMetric.Speed < MAX_SPEED {
		if CurrentModule.LastMetric.IsRunning && CurrentModule.LastMetric.Fuel > 0 {
			if MAX_SPEED - CurrentModule.LastMetric.Speed > LINEAR_FACTOR {
				acceleration = LINEAR_FACTOR
			} else {
				acceleration = MAX_SPEED - CurrentModule.LastMetric.Speed
			}
		}
	}

	// When altitude is 0, acceleration resets speed
	if CurrentModule.LastMetric.Altitude == 0 && !(CurrentModule.LastMetric.IsRunning && CurrentModule.LastMetric.Fuel > 0){
		acceleration = -CurrentModule.LastMetric.Speed
	}

	// Coordinates variation (random)
	latitudeVariation := 0.0
	longitudeVariation := 0.0
	if CurrentModule.LastMetric.IsRunning && CurrentModule.LastMetric.Fuel > 0 {
		latitudeVariation = rand.Float64() - 0.5
		longitudeVariation = rand.Float64() - 0.5
	}

	newMetric := Metric{
		// min + rand.Float64() * (max - min)
		// rand.Intn(max - min) + min
		Altitude:   CurrentModule.LastMetric.Altitude + altitudeVariation,
		Fuel:       CurrentModule.LastMetric.Fuel + fuelVariation,
		Pressure:   newPressure,
		IsAttached: CurrentModule.LastMetric.IsAttached,
		HasLanded:  CurrentModule.LastMetric.HasLanded,
		IsRunning:  CurrentModule.LastMetric.IsRunning,
		Speed:      CurrentModule.LastMetric.Speed + acceleration,
		Latitude:   CurrentModule.LastMetric.Latitude + float32(latitudeVariation),
		Longitude:  CurrentModule.LastMetric.Longitude + float32(longitudeVariation),
		IdModule:   CurrentModule.Id,
		Timestamp:  time.Now(),
	}
	writeJSONMetric(newMetric)

	CurrentModule.LastMetric = newMetric
}

func resolveAutoActions() {
	if CurrentModule.LastMetric.IsRunning {
		log.Printf("Speed: %d - Altitude: %d - Pressure: %f - Fuel: %f\n", CurrentModule.LastMetric.Speed, CurrentModule.LastMetric.Altitude, CurrentModule.LastMetric.Pressure, CurrentModule.LastMetric.Fuel)
	}
	// MAX Q check -- decrease speed if reached
	if CurrentModule.LastMetric.Pressure > CurrentModule.MaxPressure {
		log.Println(CurrentModule.LastMetric.Pressure)
		log.Println(CurrentModule.MaxPressure)
		sendEventToKafka(Event{
			Timestamp:   time.Time{},
			IdModule:    CurrentModule.Id,
			Label:       "max_q",
			Initiator:   "auto",
			Description: "[" + CurrentModule.Type + "] Max Q reached - decreasing thrusters power",
			RocketId: rocketId,
		})
		LINEAR_FACTOR = 0
		CurrentModule.LastMetric.Speed = int((CurrentModule.MaxPressure-1) * PRESSURE_FACTOR)
	}

	// Fuel level check to auto detach
	if CurrentModule.LastMetric.Fuel <= CurrentModule.MinFuelToLand && CurrentModule.LastMetric.IsAttached && CurrentModule.LastMetric.IsRunning{
		sendEventToKafka(Event{
			Timestamp:   time.Time{},
			IdModule:    CurrentModule.Id,
			Label:       "detach",
			Initiator:   "auto",
			Description: "["+ CurrentModule.Type +"] Fuel level reached minimum value - cutting off engine",
			RocketId: rocketId,
		})
		sendEventToKafka(Event{
			Timestamp:   time.Time{},
			IdModule:    CurrentModule.Id,
			Label:       "detach",
			Initiator:   "auto",
			Description: "["+ CurrentModule.Type +"] Detaching module",
			RocketId: rocketId,
		})
		CurrentModule.LastMetric.IsAttached = false
		if CurrentModule.Type == ModuleTypeMiddle{
			CurrentModule.LastMetric.Speed = 0
			CurrentModule.LastMetric.IsRunning = false
		}
	}

	if CurrentModule.LastMetric.IsAttached == false && CurrentModule.Type == ModuleTypeBooster && CurrentModule.LastMetric.HasLanded == false {

		sendEventToKafka(Event{
			Timestamp:   time.Time{},
			IdModule:    CurrentModule.Id,
			Label:       "landing",
			Initiator:   "auto",
			Description: "["+ CurrentModule.Type +"] flip maneuver engaged for landing",
		})
		CurrentModule.LastMetric.HasLanded = true

		go func() {

			time.Sleep(5 * time.Second)
			sendEventToKafka(Event{
				Timestamp:   time.Time{},
				IdModule:    CurrentModule.Id,
				Label:       "landing",
				Initiator:   "auto",
				Description: "["+ CurrentModule.Type +"] entry burn in the atmosphere",
				RocketId: rocketId,
			})

			go func(){
				for ; CurrentModule.LastMetric.Altitude > 200; {

				}
				time.Sleep(2 * time.Second)
				sendEventToKafka(Event{
					Timestamp:   time.Time{},
					IdModule:    CurrentModule.Id,
					Label:       "landing",
					Initiator:   "auto",
					Description: "[" + CurrentModule.Type + "] landing burn",
					RocketId: rocketId,
				})

				time.Sleep(2 * time.Second)
				sendEventToKafka(Event{
					Timestamp:   time.Time{},
					IdModule:    CurrentModule.Id,
					Label:       "landing",
					Initiator:   "auto",
					Description: "[" + CurrentModule.Type + "] legs deployed",
					RocketId: rocketId,
				})

				time.Sleep(2 * time.Second)
				sendEventToKafka(Event{
					Timestamp:   time.Time{},
					IdModule:    CurrentModule.Id,
					Label:       "landing",
					Initiator:   "auto",
					Description: "[" + CurrentModule.Type + "] landing on ground",
					RocketId: rocketId,
				})
				CurrentModule.LastMetric.IsRunning = false
			}()

		}()
	}

	// Altitude check to auto detach
	if CurrentModule.Type == ModuleTypePayload { // only payload will be detached at given altitude
		if CurrentModule.LastMetric.Altitude >= CurrentModule.DetachAltitude && CurrentModule.LastMetric.IsAttached && CurrentModule.LastMetric.IsRunning {
			CurrentModule.LastMetric.IsRunning = false
			sendEventToKafka(Event{
				Timestamp:   time.Time{},
				IdModule:    CurrentModule.Id,
				Label:       "detach",
				Initiator:   "auto",
				Description: "["+ CurrentModule.Type +"] is now deployed",
				RocketId: rocketId,
			})
			CurrentModule.LastMetric.IsAttached = false
			CurrentModule.LastMetric.Speed = 0
		}
	}
}

// Generate & add a random metric every 1 second
func generateMetric(done <-chan bool) {
	if CurrentModule.Type == ModuleTypeMiddle{
		AltitudeToStartPower = 1480
	} else if CurrentModule.Type == ModuleTypePayload{
		AltitudeToStartPower = CurrentModule.DetachAltitude - 1
	}

	ticker := time.NewTicker(1 * time.Second)
	go func() {
		for {
			select {
			case <-done:
				ticker.Stop()
				return
			case <-ticker.C:
				createNewMetric() // Generate a new mocked metric
				if CurrentModule.LastMetric.Pressure > CurrentModule.MaxPressure && (CurrentModule.Type == ModuleTypeMiddle || CurrentModule.Type == ModuleTypePayload){
					MAX_SPEED = 120
					CurrentModule.LastMetric.Speed = MAX_SPEED
				}
				if CurrentModule.LastMetric.Altitude >= AltitudeToStartPower {
					if CurrentModule.Type == ModuleTypeMiddle{
						MAX_SPEED = 100
					} else if CurrentModule.Type == ModuleTypePayload{
						MAX_SPEED = 80
					}
					fuelCanLower = true
					resolveAutoActions() // Analyze metrics and take auto actions according to them
				}
			}
		}
	}()
}

// Write into the AnalogFile json file
func writeJSONMetric(jsonObj interface{}) (err error) {
	// Write Boom into analog
	mu.Lock()
	defer mu.Unlock()
	// Write metrics in mocked analog (https://medium.com/eaciit-engineering/better-way-to-read-and-write-json-file-in-golang-9d575b7254f2)
	AnalogFile.Sync()
	// Clean the file before writing
	AnalogFile.Truncate(0)
	AnalogFile.Seek(0, 0)

	encoder := json.NewEncoder(AnalogFile)
	err = encoder.Encode(jsonObj)
	if err != nil {
		log.Println("Write JSON Metric error")
		//log.Fatal(err)
	}
	return
}

type moduleActionsServer struct {
	actions.UnimplementedModuleActionsServer
}

// Make the module go BOOM
func (s *moduleActionsServer) Boom(ctx context.Context, empty *actions.Empty) (*actions.BoomReply, error) {
	boomMessage := "Module Boom in 5 seconds"
	log.Println(boomMessage)

	CurrentModule.LastMetric.Pressure =  -1
	CurrentModule.LastMetric.IsBoom = true
	writeJSONMetric(CurrentModule.LastMetric)

	// TODO /ok return ko ?
	sendEventToKafka(Event{
		Timestamp:   time.Time{},
		IdModule:    CurrentModule.Id,
		Label:       "Boom",
		Initiator:   "auto",
		Description: "["+ CurrentModule.Type +"] auto destruction engaged",
		RocketId: rocketId,
	})

	// Exit system in 5 seconds to simulate boom
	//time.AfterFunc(5*time.Second, func() { os.Exit(0) })
	os.Exit(0)

	return &actions.BoomReply{Content: boomMessage}, nil
}

// Detach the module from its predecessor
func (s *moduleActionsServer) Detach(ctx context.Context, empty *actions.Empty) (*actions.Boolean, error) {
	log.Println("Detaching module:")
	CurrentModule.LastMetric.IsAttached = false
	sendEventToKafka(Event{
		Timestamp:   time.Time{},
		IdModule:    CurrentModule.Id,
		Label:       "detach",
		Initiator:   "manual",
		Description: "Detaching module",
		RocketId: rocketId,
	})
	return &actions.Boolean{Val: true}, nil
}

// Set thrusters so that the rocket goes to a certain speed
func (s *moduleActionsServer) SetThrustersSpeed(ctx context.Context, value *actions.Double) (*actions.SetThrustersSpeedReply, error) {
	res := "Thrusters speed is now " + fmt.Sprintf("%F", value.GetVal())
	log.Println(res)
	CurrentModule.LastMetric.Speed = int(value.GetVal())
	return &actions.SetThrustersSpeedReply{Content: res}, nil
}

// Ok route for healthcheck
func (s *moduleActionsServer) Ok(ctx context.Context, empty *actions.Empty) (*actions.OkReply, error) {
	log.Println("Ok")
	return &actions.OkReply{Content: "Ok"}, nil
}

// Start or stop the engine
func (s *moduleActionsServer) ToggleRunning(ctx context.Context, empty *actions.Empty) (*actions.RunningReply, error) {
	var message string

	// If the module is currently on
	if CurrentModule.LastMetric.IsRunning {
		message = "Stop the engine"
	} else {
		message = "Start the engine"
	}
	sendEventToKafka(Event{
		Timestamp:   time.Time{},
		IdModule:    CurrentModule.Id,
		Label:       "toggle_running",
		Initiator:   "manual",
		Description: "["+ CurrentModule.Type +"]" + message,
		RocketId: rocketId,
	})
	log.Println(message)
	CurrentModule.LastMetric.IsRunning = !CurrentModule.LastMetric.IsRunning
	return &actions.RunningReply{Content: message}, nil
}

// Set value for the altitude at which the module has to detach itself
func (s *moduleActionsServer) SetAltitudeToDetach(ctx context.Context, value *actions.Double) (*actions.SetAltitudeToDetachReply, error) {
	res := "Altitude to detach is now " + fmt.Sprintf("%F", value.GetVal()) + "km"
	log.Println(res)
	CurrentModule.DetachAltitude = int(value.GetVal())
	AltitudeToStartPower = CurrentModule.DetachAltitude - 100
	return &actions.SetAltitudeToDetachReply{Content: res}, nil
}

func sendEventToKafka(event Event){
	err := kafkaCon.SetWriteDeadline(time.Now().Add(10*time.Second))
	if err != nil {
		log.Fatal("failed to set kafka config:", err)
		return
	}
	s, err := json.Marshal(event)
	if err != nil {
		log.Fatal("failed to marshal event:", err)
		return
	}
	_, err = kafkaCon.WriteMessages(
		kafka.Message{Value: s},
	)
	if err != nil {
		log.Fatal("failed to write messages:", err)
	}
}

func main() {
	// If there is a port variable set in env
	var port string
	if port = os.Getenv("PORT"); port == "" {
		port = "3005"
	}

	// Retrieve the ID of the Module
	var idModule int
	if idModule, _ = strconv.Atoi(os.Getenv("ID_MODULE")); idModule == 0 {
		log.Println("Error : no IdModule provided. Exit")
		os.Exit(-1)
	}

	if rocketId, _ = strconv.Atoi(os.Getenv("ROCKET_ID")); rocketId == 0 {
		log.Println("Error : no rocketId provided. Exit")
		os.Exit(-1)
	}

	CurrentModule.Id = idModule
	var moduleType string
	if moduleType = os.Getenv("MODULE_TYPE"); moduleType == "" {
		log.Println("Error : no moduleType provided. Exit")
		os.Exit(-1)
	}
	log.Println(moduleType)
	CurrentModule.Type = moduleType
	AnalogFile, _ = os.OpenFile("/etc/module-logs/analog-mock-" + moduleType + ".json", os.O_CREATE|os.O_SYNC|os.O_WRONLY, os.ModePerm)


	// to produce messages
	conn, err := kafka.DialLeader(context.Background(), "tcp", "kafka-service:9092", TopicRocketEvent, 0)
	if err != nil {
		log.Fatal("failed to dial leader:", err)
	}
	kafkaCon = conn

	// Generate first metric

	if CurrentModule.Type == ModuleTypeBooster {
		CurrentModule.LastMetric = Metric{
			Timestamp:  time.Now(),
			IdModule:   CurrentModule.Id,
			Altitude:   0,
			Fuel:       1000,
			Pressure:   1,
			Speed:      0,
			Latitude:   43.6656112,
			Longitude:  7.0701789,
			IsAttached: true,
			IsRunning:  false,
			IsBoom:     false,
			HasLanded:  false,
		}
		CurrentModule.MinFuelToLand = 50
	}else if CurrentModule.Type == ModuleTypeMiddle{
		CurrentModule.LastMetric = Metric{
			Timestamp:  time.Now(),
			IdModule:   CurrentModule.Id,
			Altitude:   0,
			Fuel:       400,
			Pressure:   1,
			Speed:      0,
			Latitude:   43.6656112,
			Longitude:  7.0701789,
			IsAttached: true,
			IsRunning:  false,
			IsBoom:     false,
			HasLanded:  false,
		}
		CurrentModule.MinFuelToLand = 20
	}else{
		CurrentModule.LastMetric = Metric{
			Timestamp:  time.Now(),
			IdModule:   CurrentModule.Id,
			Altitude:   0,
			Fuel:       100,
			Pressure:   1,
			Speed:      0,
			Latitude:   43.6656112,
			Longitude:  7.0701789,
			IsAttached: true,
			IsRunning:  false,
			IsBoom:     false,
			HasLanded:  false,
		}
		CurrentModule.MinFuelToLand = 0
	}
	CurrentModule.DetachAltitude = 2000
	CurrentModule.MaxPressure = 7.0
	writeJSONMetric(CurrentModule.LastMetric)


	// CRON to generate random metric every second
	gene := make(chan bool, 1)
	generateMetric(gene)

	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	} else {
		log.Println("gRPC Server is running on port " + port)
	}
	s := grpc.NewServer()
	actions.RegisterModuleActionsServer(s, &moduleActionsServer{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
