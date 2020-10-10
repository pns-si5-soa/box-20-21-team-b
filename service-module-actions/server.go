package actions

import (
	"context"
	"google.golang.org/grpc"
	"io"
	"log"
	"math/rand"
	"net"
	"net/http"
	"os"
	"strconv"
	"time"
)

// A module representation
type Module struct {
}

// Custom error to return in case of a JSON parsing error
type JSONError struct {
	Message string `json:"Message"`
}

type moduleActionsServer struct {
	UnimplementedModuleActionsServer
}

func (s *moduleActionsServer) Boom(ctx context.Context, empty *Empty) (*BoomReply, error) {
	boomMessage := "Module went Boom !"
	log.Println(boomMessage)
	return &BoomReply{Content: &boomMessage}, nil
}

// Make the module go BOOM
func boom(w http.ResponseWriter, req *http.Request) {
	_, err := io.WriteString(w, "Module went BOOM")
	if err != nil {
		log.Fatal(err)
	}
}

// Reboot
func reboot(w http.ResponseWriter, req *http.Request) {
	_, err := io.WriteString(w, "Rebooting coz IQ reached a null value")
	if err != nil {
		log.Fatal(err)
	}
}


// Set the module's speed to a fixed value
func setThrustersSpeed(w http.ResponseWriter, req *http.Request) {
	_, err := io.WriteString(w, "Module went BOOM")
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	// If there is a seed variable set in env
	if os.Getenv("SEED") != "" {
		seed, err := strconv.ParseInt(os.Getenv("SEED"), 10, 64)
		if err != nil {
			log.Fatal(err)
		}
		rand.Seed(seed)
	} else {
		rand.Seed(time.Now().UnixNano())
	}

	// If there is a port variable set in env
	var port string
	if port = os.Getenv("PORT"); port == "" {
		port = "3004"
	}

	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	RegisterModuleActionsServer(s, &moduleActionsServer{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
