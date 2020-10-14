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
	"sync"
	"time"
)

// A module representation
type Module struct {
}

// A simple metric for telemetry
type Metric struct {
	Altitude  int       `json:"altitude"`
	Fuel      float32   `json:"fuel"`
	Pressure  float32   `json:"pressure"`
	Attached  bool      `json:"attached"`
	Running   bool      `json:"running"`
	Speed     int       `json:"speed"`
	Latitude  float32   `json:"latitude"`
	Longitude float32   `json:"longitude"`
	Timestamp time.Time `json:"timestamp"`
	Boom      bool      `json:"boom"`
}

// Path of the mocked analog system
const AnalogFilePath = "/etc/analog-mock.json"

//const AnalogFilePath = "../analog-mock.json"

var Analog, _ = os.OpenFile(AnalogFilePath, os.O_CREATE|os.O_SYNC|os.O_WRONLY, os.ModePerm)
var mu sync.Mutex // Its mutex for read / write
var lastMetric Metric // Last metric generated


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
				if lastMetric.Running {
					fuelVariation = -0.1 + rand.Float32()*(-0.5 - -0.1)
				}

				newMetric := Metric{
					// min + rand.Float64() * (max - min)
					// rand.Intn(max - min) + min
					Altitude:  lastMetric.Altitude + rand.Intn(100-5) + 5,
					Fuel:      lastMetric.Fuel + fuelVariation,
					Pressure:  lastMetric.Pressure + 0 + rand.Float32()*((7.2-lastMetric.Pressure)-0),
					Attached:  lastMetric.Attached,
					Running:   lastMetric.Running,
					Speed:     lastMetric.Speed + rand.Intn(150 - -150) + -150,
					Latitude:  lastMetric.Latitude + -0.5 + rand.Float32()*(-0.5 - -0.5),
					Longitude: lastMetric.Longitude + -0.5 + rand.Float32()*(-0.5 - -0.5),
					Timestamp: time.Now(),
				}
				writeJSONMetric(newMetric)
			}
		}
	}()
}

// Write into the Analog json file
func writeJSONMetric(jsonObj interface{}) (err error) {
	// Write Boom into analog
	mu.Lock()
	defer mu.Unlock()
	// Write metrics in mocked analog (https://medium.com/eaciit-engineering/better-way-to-read-and-write-json-file-in-golang-9d575b7254f2)
	Analog.Sync()
	// Clean the file before writing
	Analog.Truncate(0)
	Analog.Seek(0, 0)

	encoder := json.NewEncoder(Analog)
	err = encoder.Encode(jsonObj)
	if err != nil {
		log.Println("Write JSON error")
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

	lastMetric.Boom = true

	// TODO /ok return ko ?

	// Exit system in 5 seconds to simulate boom
	time.AfterFunc(5*time.Second, func() { os.Exit(0) })

	return &actions.BoomReply{Content: boomMessage}, nil
}

// Detach the module from its predecessor
func (s *moduleActionsServer) Detach(ctx context.Context, empty *actions.Empty) (*actions.Boolean, error) {
	log.Println("Detaching module:")

	lastMetric.Attached = false

	return &actions.Boolean{Val: true}, nil
}

// Set thrusters so that the rocket goes to a certain speed
func (s *moduleActionsServer) SetThrustersSpeed(ctx context.Context, value *actions.Double) (*actions.SetThrustersSpeedReply, error) {
	res := "Thrusters speed is now " + fmt.Sprintf("%F", value.GetVal())
	log.Println(res)

	lastMetric.Speed = int(value.GetVal())

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
	if lastMetric.Running {
		message = "Stop the engine"
	} else {
		message = "Start the engine"
	}

	log.Println(message)
	lastMetric.Attached = !lastMetric.Attached

	return &actions.RunningReply{Content: message}, nil
}

func main() {
	// If there is a port variable set in env
	var port string
	if port = os.Getenv("PORT"); port == "" {
		port = "3005"
	}

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
