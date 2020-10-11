package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
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
	Running   bool      `json:"running"`
	Speed     int       `json:"speed"`
	Latitude  float32   `json:"latitude"`
	Longitude float32   `json:"longitude"`
	Timestamp time.Time `json:"timestamp"`
}

// Custom error to return in case of a JSON parsing error
type JSONError struct {
	Message string `json:"Message"`
}

// The current module (stateful)
var CurrentModule Module

// Max metrics entry saved in cache, currently 24h with 1 log per second
const MaxCache int = 86400

// Add a metric to the current module's cache
func appendMetric(metric Metric) {
	// If the cache is full (24 hours of logs with 1 log / second), pop the last entry (FIFO)
	if len(CurrentModule.LastMetrics) == MaxCache {
		CurrentModule.LastMetrics = CurrentModule.LastMetrics[:len(CurrentModule.LastMetrics)-1]
	}

	// Add the current metric at the first place (FIFO)
	CurrentModule.LastMetrics = append([]Metric{metric}, CurrentModule.LastMetrics...)

	// TODO add write in analog
}

// Return all the metrics newer than the timestamp
func getMetricsFromTimestamp(timestamp time.Time) []Metric {
	metricsFrom := make([]Metric, 0, MaxCache)

	for _, metric := range CurrentModule.LastMetrics {
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

// List the metrics after a given timestamp
func metrics(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(req)
	var listMetrics []Metric // List of metrics to return

	// Get the timestamp from parameter
	timestampParam, ok := params["timestamp"]

	// If there is no timestamp
	if !ok {
		e := JSONError{Message: "Internal Server Error"}
		w.WriteHeader(http.StatusInternalServerError)
		err2 := json.NewEncoder(w).Encode(e)
		log.Panic("No timestamp provided", err2)
	}

	// TODO choose timestamp template
	timestamp, err := time.Parse(time.RFC3339, timestampParam)
	if err != nil {
		log.Panic(err)
	}
	listMetrics = getMetricsFromTimestamp(timestamp)

	// Return logs as a JSON object
	jsonError := json.NewEncoder(w).Encode(listMetrics)
	if jsonError != nil {
		e := JSONError{Message: "Internal Server Error"}
		w.WriteHeader(http.StatusInternalServerError)
		err2 := json.NewEncoder(w).Encode(e)
		log.Panic(err, err2)
	}
}

// List all the metrics
func allMetrics(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Return logs as a JSON object
	err := json.NewEncoder(w).Encode(CurrentModule.LastMetrics)
	if err != nil {
		e := JSONError{Message: "Internal Server Error"}
		w.WriteHeader(http.StatusInternalServerError)
		err2 := json.NewEncoder(w).Encode(e)
		log.Panic(err, err2)
	}
}

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
				// TODO get last from analog
				last := CurrentModule.LastMetrics[len(CurrentModule.LastMetrics)-1]

				// We decrease fuel only if the module is running
				var fuelVariation float32
				if last.Running {
					fuelVariation = -0.1 + rand.Float32()*(-0.5 - -0.1)
				}

				appendMetric(Metric{
					// min + rand.Float64() * (max - min)
					// rand.Intn(max - min) + min
					Altitude:  last.Altitude + rand.Intn(100-5) + 5,
					Fuel:      last.Fuel + fuelVariation,
					Pressure:  last.Pressure + 0 + rand.Float32()*((7.2-last.Pressure)-0),
					Attached:  last.Attached,
					Running:   last.Running,
					Speed:     last.Speed + rand.Intn(150 - -150) + -150,
					Latitude:  last.Latitude + -0.5 + rand.Float32()*(-0.5 - -0.5),
					Longitude: last.Longitude + -0.5 + rand.Float32()*(-0.5 - -0.5),
					Timestamp: time.Now(),
				})
			}
		}
	}()
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
		port = "3003"
	}

	// TODO Add backup / Restore for cache

	CurrentModule = Module{LastMetrics: make([]Metric, 0, MaxCache)}
	appendMetric(Metric{
		Altitude:  100,
		Fuel:      20.0,
		Pressure:  1,
		Attached:  true,
		Running:   true,
		Speed:     4000,
		Latitude:  25.333,
		Longitude: 52.666,
		Timestamp: time.Now(),
	})

	// CRON to generate random metric every second
	gene := make(chan bool, 1)
	generateMetric(gene)

	// Create a new router to serve routes
	router := mux.NewRouter()

	// All the routes of the app
	router.HandleFunc("/module-metrics/ok", ok).Methods("GET")
	router.HandleFunc("/module-metrics/metrics", allMetrics).Methods("GET")
	router.HandleFunc("/module-metrics/metrics/{timestamp}", metrics).Methods("GET")

	fmt.Println("Server is running on port " + port)

	// Start the server
	log.Fatal(http.ListenAndServe(":"+port, router))
}
