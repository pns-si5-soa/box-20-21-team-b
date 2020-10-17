package main

import (
	"context"
	"encoding/json"
	"fmt"
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

				// We decrease fuel only if the module is running
				var fuelVariation float32
				if CurrentModule.LastMetric.IsRunning && CurrentModule.LastMetric.Fuel > 0 {
					fuelVariation = -0.1 + rand.Float32()*(-0.5 - -0.1)
					// Avoid negative fuel
					if CurrentModule.LastMetric.Fuel+fuelVariation < 0 {
						fuelVariation = CurrentModule.LastMetric.Fuel
					}
				}

				// Avoid negative pressure
				pressureVariation := -0.5 + rand.Float32()*(-0.5 - -0.5)
				// Avoid negative fuel
				if CurrentModule.LastMetric.Pressure+fuelVariation < 0 {
					pressureVariation = CurrentModule.LastMetric.Pressure
				}

				// Avoid negative speed
				speedVariation := rand.Intn(300 - -150) + -150
				if CurrentModule.LastMetric.Speed < 150 && speedVariation < 0 {
					speedVariation = -speedVariation
				}

				newMetric := Metric{
					// min + rand.Float64() * (max - min)
					// rand.Intn(max - min) + min
					Altitude:   CurrentModule.LastMetric.Altitude + rand.Intn(100-5) + 5,
					Fuel:       CurrentModule.LastMetric.Fuel + fuelVariation,
					Pressure:   CurrentModule.LastMetric.Pressure + pressureVariation,
					IsAttached: CurrentModule.LastMetric.IsAttached,
					IsRunning:  CurrentModule.LastMetric.IsRunning,
					Speed:      CurrentModule.LastMetric.Speed + speedVariation,
					Latitude:   CurrentModule.LastMetric.Latitude + -0.05 + rand.Float32()*(0.05 - -0.05),
					Longitude:  CurrentModule.LastMetric.Longitude + -0.05 + rand.Float32()*(0.05 - -0.05),
					IdModule:   CurrentModule.Id,
					Timestamp:  time.Now(),
				}
				writeJSONMetric(newMetric)
				writeJSONEvent(Event{
					Timestamp:   time.Now(),
					IdModule:    CurrentModule.Id,
					Label:       "labelrouge",
					Initiator:   "torinitia",
					Description: "desc",
				})

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
	// TODO add log event

	// TODO /ok return ko ?

	// Exit system in 5 seconds to simulate boom
	time.AfterFunc(5*time.Second, func() { os.Exit(0) })

	return &actions.BoomReply{Content: boomMessage}, nil
}

// Detach the module from its predecessor
func (s *moduleActionsServer) Detach(ctx context.Context, empty *actions.Empty) (*actions.Boolean, error) {
	log.Println("Detaching module:")

	CurrentModule.LastMetric.IsAttached = false
	// TODO add log event

	return &actions.Boolean{Val: true}, nil
}

// Set thrusters so that the rocket goes to a certain speed
func (s *moduleActionsServer) SetThrustersSpeed(ctx context.Context, value *actions.Double) (*actions.SetThrustersSpeedReply, error) {
	res := "Thrusters speed is now " + fmt.Sprintf("%F", value.GetVal())
	log.Println(res)

	// TODO add log event
	CurrentModule.LastMetric.Speed = int(value.GetVal())

	return &actions.SetThrustersSpeedReply{Content: res}, nil
}

// Detach the module from its predecessor
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
	// TODO add log event
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

	// Generte first metric

	CurrentModule.LastMetric = Metric{
		Timestamp:  time.Now(),
		IdModule:   CurrentModule.Id,
		Altitude:   15,
		Fuel:       1000,
		Pressure:   1,
		Speed:      342,
		Latitude:   43.6656112,
		Longitude:  7.0701789,
		IsAttached: false,
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
