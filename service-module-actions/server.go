package main

import (
	"./actions"
	"context"
	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
)

const (
	port = ":3005"
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
	boomMessage := "Module went Boom !"
	log.Println(boomMessage)
	return &actions.BoomReply{Content: &boomMessage}, nil
}

// Detach the module from its predecessor
func (s *moduleActionsServer) Detach(ctx context.Context, empty *actions.Empty) (*actions.Boolean, error) {
	res := true
	log.Println("Detaching module:")
	return &actions.Boolean{Val: &res}, nil
}

// Set thrusters so that the rocket goes to a certain speed
func (s *moduleActionsServer) SetThrustersSpeed(ctx context.Context, value *actions.Double) (*actions.SetThrustersSpeedReply, error) {
	res := "Thrusters speed is now " + fmt.Sprintf("%F", value.GetVal())
	log.Println(res)
	return &actions.SetThrustersSpeedReply{Content: &res}, nil
}

func main() {
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
