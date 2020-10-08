package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	//"go.mongodb.org/mongo-driver/mongo/readpref"
	"encoding/json"
	"github.com/gorilla/mux"
)

type Module struct {
	Altitude int     `json:"altitude"`
	Fuel     float32 `json:"fuel"`
	Pressure float32 `json:"pressure"`
	Attached bool    `json:"attached"`
	Speed    int     `json:"speed"`
	Latitude float32 `json:"latitude"`
	Longitude float32 `json:"longitude"`
}

//func (m Module) getMetricsAsJSON(timestamp string) (metricsJson []byte) {
//	metricsJson, err := json.Marshal(m)
//	if err != nil {
//		log.Fatal(err)
//	}
//	return
//}

func ok(w http.ResponseWriter, req *http.Request) {
	io.WriteString(w, "ok")
}

func metrics(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(req)

	timestamp, ok := params["timestamp"]
	if !ok {
		log.Print("No timestamp arg (/metrics)")
	}

	if timestamp == "1" {
		fmt.Println("Got arg !")
	}

	module := Module{
		Altitude:  100,
		Fuel:      5.3,
		Pressure:  0.9,
		Attached:  true,
		Speed:     130,
		Latitude:  45.766,
		Longitude: 8.335,
	}
	err := json.NewEncoder(w).Encode(module)
	if err != nil {
		log.Fatal(err)
	}
}

func mongoInit() context.CancelFunc {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://" + os.Getenv("MONGO_HOST") + ":" + os.Getenv("MONGO_PORT") + "/" + os.Getenv("MONGO_DB")))
	if err != nil {
		log.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	return cancel
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/module-metrics/ok", ok).Methods("GET")
	router.HandleFunc("/module-metrics/metrics/{timestamp}", metrics).Methods("GET")

	fmt.Println("Server is running on port " + os.Getenv("PORT"))
	log.Fatal(http.ListenAndServe(":" + os.Getenv("PORT"), router))
}
