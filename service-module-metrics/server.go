package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

// A module representation
type Module struct {
	LastMetrics []Metric // Cache of last 24 hours of log (1 per second)
}

// A simple metric for telemetry
type Metric struct {
	Altitude  int       `json:"altitude"`
	Fuel      float32   `json:"fuel"`
	Pressure  float32   `json:"pressure"`
	Attached  bool      `json:"attached"`
	Speed     int       `json:"speed"`
	Latitude  float32   `json:"latitude"`
	Longitude float32   `json:"longitude"`
	Timestamp time.Time `json:"timestamp"`
}

// Custom error to return in case of a JSON parcing error
type JSONError struct {
	Message string `json:"Message"`
}

// The current module (stateful)
var CurrentModule Module

const MaxCache int = 86400

// Add a metric to the current module's cache
func appendMetric(metric Metric) {
	// If the cache is full (24 hours of logs with 1 log / second), pop the last entry (FIFO)
	if len(CurrentModule.LastMetrics) == MaxCache {
		CurrentModule.LastMetrics = CurrentModule.LastMetrics[:len(CurrentModule.LastMetrics)-1]
	}

	// Add the current metric at the first place (FIFO)
	CurrentModule.LastMetrics = append([]Metric{metric}, CurrentModule.LastMetrics...)
}

// Return all the metrics newer than the timestamp
func getMetricsFromTimestamp(timestamp time.Time) []Metric {
	metricsFrom := make([]Metric, 0, MaxCache)

	for _, metric := range metricsFrom {
		if metric.Timestamp.After(timestamp) {
			metricsFrom = append(metricsFrom, metric)
		} else {
			return metricsFrom
		}
	}

	return metricsFrom
}

// Basic OK route for healthcheck
func ok(w http.ResponseWriter, req *http.Request) {
	_, err := io.WriteString(w, "ok")
	if err != nil {
		log.Fatal(err)
	}
}

// List all the metrics after a given timestamp, or all
func metrics(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(req)
	var listMetrics []Metric // List of metrics to return

	// Get the timestamp from parameter
	timestamp, ok := params["timestamp"]

	// If there is no timestamp
	if !ok {
		listMetrics = CurrentModule.LastMetrics
	} else { // There is a timestamp
		timestamp, err := time.Parse(time.StampNano, timestamp)
		if err != nil {
			panic(err)
		}
		listMetrics = getMetricsFromTimestamp(timestamp)
	}

	// Return logs as a JSON object
	err := json.NewEncoder(w).Encode(listMetrics)
	if err != nil {
		e := JSONError{Message: "Internal Server Error"}
		w.WriteHeader(http.StatusInternalServerError)
		err2 := json.NewEncoder(w).Encode(e)
		log.Fatal(err, err2)
	}
}

func main() {
	// TODO Add backup / Restore for cache

	CurrentModule = Module{LastMetrics: make([]Metric, 0, MaxCache)}

	// TODO Add "cron" metrics generator

	// Create a new router to serve routes
	router := mux.NewRouter()

	// All the routes of the app
	router.HandleFunc("/module-metrics/ok", ok).Methods("GET")
	router.HandleFunc("/module-metrics/metrics/{timestamp}", metrics).Methods("GET")

	fmt.Println("Server is running on port " + os.Getenv("PORT"))

	// Start the server
	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), router))
}
