package main

import (
	"context"
	"encoding/json"
	"fmt"
	"google.golang.org/grpc"
	"io/ioutil"
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
}

// A event representation
type Event struct {
	Timestamp   time.Time `json:"timestamp"`
	IdModule    int       `json:"idModule"`
	Label       string    `json:"label"`
	Initiator   string    `json:"initiator"`
	Description string    `json:"description"`
}

// Path of the mocked analog system
const AnalogFilePath = "/etc/analog-mock.json"

// Path of the mocked event system
const EventFilePath = "/etc/event-mock.json"

var EventFile, _ = os.OpenFile(EventFilePath, os.O_CREATE|os.O_SYNC|os.O_WRONLY, os.ModePerm)

var AnalogFile, _ = os.OpenFile(AnalogFilePath, os.O_CREATE|os.O_SYNC|os.O_WRONLY, os.ModePerm)
var mu sync.Mutex   // Its mutex for read / write analog
var mumu sync.Mutex // Its mutex for read / write event
var CurrentModule Module

// Generate & add a random metric every 1 second
func generateMetric(done <-chan bool) {
	ticker := time.NewTicker(1 * time.Second)
	go func() {
		for {
			select {
			case <-done:
				ticker.Stop()
				return
			case <-ticker.C:
				// Generation from last metric
				LINEAR_FACTOR := 4 // Linear factor <=> acceleration and altitudeVariation value

				// ALtitude variation
				altitudeVariation := CurrentModule.LastMetric.Speed/3
				// If not running, altitude decreases instead of increasing
				if !(CurrentModule.LastMetric.IsRunning && CurrentModule.LastMetric.Fuel > 0) {
					altitudeVariation = -altitudeVariation
					// Avoid negative altitude
					if CurrentModule.LastMetric.Altitude + altitudeVariation < 0 {
						altitudeVariation = -CurrentModule.LastMetric.Altitude
					}
				}

				// We decrease fuel only if the module is running
				var fuelVariation float32
				if CurrentModule.LastMetric.IsRunning && CurrentModule.LastMetric.Fuel > 0 {
					fuelVariation = -5
					// Avoid negative fuel
					if CurrentModule.LastMetric.Fuel+fuelVariation < 0 {
						fuelVariation = CurrentModule.LastMetric.Fuel
					}
				}

				// Pressure is 1 at 0m, 0 at 10000m, decreasing linearly
				newPressure := 1.0-((1.0/10000.0)*float32(CurrentModule.LastMetric.Altitude))
				if newPressure < 0.0 {
					newPressure = 0.0
				}

				// Speed variation: acceleration is 0 when not running
				MAX_SPEED := 4000 // Max speed of the rocket
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
					IsRunning:  CurrentModule.LastMetric.IsRunning,
					Speed:      CurrentModule.LastMetric.Speed + int(acceleration),
					Latitude:   CurrentModule.LastMetric.Latitude + float32(latitudeVariation),
					Longitude:  CurrentModule.LastMetric.Longitude + float32(longitudeVariation),
					IdModule:   CurrentModule.Id,
					Timestamp:  time.Now(),
				}
				writeJSONMetric(newMetric)

				CurrentModule.LastMetric = newMetric
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

// Read the analog file & unmarchal metric (or return the error)
func readJSONMetric() (metric Metric) {
	AnalogFile.Sync()

	metric = Metric{}

	byteValue, _ := ioutil.ReadFile(AnalogFilePath)
	parseErr := json.Unmarshal(byteValue, &metric)
	if parseErr != nil {
		//log.Println("Error Unmarshal : ")
		//log.Println(parseErr)
		//log.Fatal(parseErr)
	}

	return
}

// Write into the EventFile json file
func writeJSONEvent(jsonObj interface{}) (err error) {
	mumu.Lock()
	defer mumu.Unlock()

	EventFile.Sync()

	encoder := json.NewEncoder(EventFile)
	err = encoder.Encode(jsonObj)
	if err != nil {
		log.Println("Write JSON Event error")
		log.Fatal(err)
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

	CurrentModule.LastMetric.IsBoom = true
	writeJSONEvent(Event{
		Timestamp:   time.Time{},
		IdModule:    CurrentModule.Id,
		Label:       "boom",
		Initiator:   "manual",
		Description: "Module exploded",
	})

	// TODO /ok return ko ?

	// Exit system in 5 seconds to simulate boom
	time.AfterFunc(5*time.Second, func() { os.Exit(0) })

	return &actions.BoomReply{Content: boomMessage}, nil
}

// Detach the module from its predecessor
func (s *moduleActionsServer) Detach(ctx context.Context, empty *actions.Empty) (*actions.Boolean, error) {
	log.Println("Detaching module:")

	CurrentModule.LastMetric.IsAttached = false
	writeJSONEvent(Event{
		Timestamp:   time.Time{},
		IdModule:    CurrentModule.Id,
		Label:       "detach",
		Initiator:   "manual",
		Description: "Module detached from its predecessor",
	})

	return &actions.Boolean{Val: true}, nil
}

// Set thrusters so that the rocket goes to a certain speed
func (s *moduleActionsServer) SetThrustersSpeed(ctx context.Context, value *actions.Double) (*actions.SetThrustersSpeedReply, error) {
	res := "Thrusters speed is now " + fmt.Sprintf("%F", value.GetVal())
	log.Println(res)

	writeJSONEvent(Event{
		Timestamp:   time.Time{},
		IdModule:    CurrentModule.Id,
		Label:       "set_thrusters_speed",
		Initiator:   "manual",
		Description: "Set thrusters speed to " + fmt.Sprintf("%F", value.GetVal()),
	})
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

	log.Println(message)
	writeJSONEvent(Event{
		Timestamp:   time.Time{},
		IdModule:    CurrentModule.Id,
		Label:       "toggle_running",
		Initiator:   "manual",
		Description: message,
	})
	CurrentModule.LastMetric.IsAttached = !CurrentModule.LastMetric.IsAttached

	return &actions.RunningReply{Content: message}, nil
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
	CurrentModule.Id = idModule

	// Generate first metric

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
		IsRunning:  true,
		IsBoom:     false,
	}
	writeJSONMetric(CurrentModule.LastMetric)

	// CRON to generate random metric every second
	gene := make(chan bool, 1)
	generateMetric(gene)

	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	} else {
		log.Println("Server is running on port " + port)
	}
	s := grpc.NewServer()
	actions.RegisterModuleActionsServer(s, &moduleActionsServer{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
