package main

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
	"os"
	"service-module-actions/v2/actions"
)

// A module representation
type Module struct {
}

// Custom error to return in case of a JSON parsing error
type JSONError struct {
	Message string `json:"Message"`
}

type moduleActionsServer struct {
	actions.UnimplementedModuleActionsServer
}

// Make the module go BOOM
func (s *moduleActionsServer) Boom(ctx context.Context, empty *actions.Empty) (*actions.BoomReply, error) {
	boomMessage := "Module Boom imminent !"
	log.Println(boomMessage)
	// TODO more actions...
	// fmt.Println("Boom imminent")
	// Write { boom: true } in analog to exit metrics
	// /ok return ko
	// defer os.Exit(0)
	return &actions.BoomReply{Content: boomMessage}, nil
}


// Detach the module from its predecessor
func (s *moduleActionsServer) Detach(ctx context.Context, empty *actions.Empty) (*actions.Boolean, error) {
	log.Println("Detaching module:")
	// TODO Write { Attached: false } in analog
	return &actions.Boolean{Val: true}, nil
}

// Set thrusters so that the rocket goes to a certain speed
func (s *moduleActionsServer) SetThrustersSpeed(ctx context.Context, value *actions.Double) (*actions.SetThrustersSpeedReply, error) {
	res := "Thrusters speed is now " + fmt.Sprintf("%F", value.GetVal())
	log.Println(res)
	// TODO Write { Speed: XXX } in analog
	return &actions.SetThrustersSpeedReply{Content: res}, nil
}

// Detach the module from its predecessor
func (s *moduleActionsServer) Ok(ctx context.Context, empty *actions.Empty) (*actions.OkReply, error) {
	log.Println("Ok")
	return &actions.OkReply{Content: "Ok"}, nil
}

// Detach the module from its predecessor
func (s *moduleActionsServer) Running(ctx context.Context, empty *actions.Empty) (*actions.RunningReply, error) {
	// TODO Write { Running: true | false } in analog
	// TODO actually use toggled state to write messages and reply
	log.Println("Toggling running state")
	return &actions.RunningReply{Content: "Now running"}, nil
}

func main() {
	// If there is a port variable set in env
	var port string
	if port = os.Getenv("PORT"); port == "" {
		port = "3005"
	}

	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	} else {
		log.Println("Server is running on port" + port)
	}
	s := grpc.NewServer()
	actions.RegisterModuleActionsServer(s, &moduleActionsServer{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
