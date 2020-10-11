package main

import (
	"context"
	"encoding/json"
	"fmt"
	"google.golang.org/grpc"
	"io/ioutil"
	"log"
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

var Analog, _ = os.OpenFile(AnalogFilePath, os.O_CREATE|os.O_SYNC|os.O_RDWR, os.ModePerm)
var mu sync.Mutex // Its mutex for read / write

// Read the analog file & unmarchal metric (or return the error)
func readJSONMetric() (Metric, error) {
	mu.Lock()
	defer mu.Unlock()

	Analog.Sync()

	metric := Metric{}

	byteValue, _ := ioutil.ReadFile(AnalogFilePath)
	parseErr := json.Unmarshal(byteValue, &metric)
	if parseErr != nil {
		log.Println("Error Unmarshal : ")
		log.Println(parseErr)
		//log.Fatal(parseErr)
	}

	return metric, parseErr
}

// Custom error to return in case of a JSON parsing error
type JSONError struct {
	Message string `json:"Message"`
}

// Write into the Analog json file
func writeJSONMetric(jsonObj interface{}) (err error) {
	// Write Boom into analog
	mu.Lock()
	defer mu.Unlock()
	// Write metrics in mocked analog (https://medium.com/eaciit-engineering/better-way-to-read-and-write-json-file-in-golang-9d575b7254f2)
	Analog.Sync()
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
	boomMessage := "Module Boom imminent !"
	log.Println(boomMessage)

	tempMetric, _ := readJSONMetric()
	tempMetric.Boom = true
	writeJSONMetric(tempMetric)

	// TODO /ok return ko ?

	// Exit system to simulate boom
	defer os.Exit(0)

	return &actions.BoomReply{Content: boomMessage}, nil
}

// Detach the module from its predecessor
func (s *moduleActionsServer) Detach(ctx context.Context, empty *actions.Empty) (*actions.Boolean, error) {
	log.Println("Detaching module:")

	tempMetric, _ := readJSONMetric()
	tempMetric.Attached = false
	writeJSONMetric(tempMetric)

	return &actions.Boolean{Val: true}, nil
}

// Set thrusters so that the rocket goes to a certain speed
func (s *moduleActionsServer) SetThrustersSpeed(ctx context.Context, value *actions.Double) (*actions.SetThrustersSpeedReply, error) {
	res := "Thrusters speed is now " + fmt.Sprintf("%F", value.GetVal())
	log.Println(res)

	tempMetric, _ := readJSONMetric()
	tempMetric.Speed = int(value.GetVal())
	writeJSONMetric(tempMetric)

	return &actions.SetThrustersSpeedReply{Content: res}, nil
}

// Detach the module from its predecessor
func (s *moduleActionsServer) Ok(ctx context.Context, empty *actions.Empty) (*actions.OkReply, error) {
	log.Println("Ok")
	return &actions.OkReply{Content: "Ok"}, nil
}

// Start or stop the engine
func (s *moduleActionsServer) ToggleRunning(ctx context.Context, empty *actions.Empty) (*actions.RunningReply, error) {
	tempMetric, _ := readJSONMetric()
	var message string

	// If the module is currently on
	if tempMetric.Running {
		message = "Stop the engine"
	} else {
		message = "Start the engine"
	}

	log.Println(message)
	tempMetric.Attached = !tempMetric.Attached
	writeJSONMetric(tempMetric)

	return &actions.RunningReply{Content: message}, nil
}

func main() {
	// If there is a port variable set in env
	var port string
	if port = os.Getenv("PORT"); port == "" {
		port = "3005"
	}

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
