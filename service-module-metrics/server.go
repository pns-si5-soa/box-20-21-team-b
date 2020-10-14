package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"io"
	"io/ioutil"
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
	Boom      bool      `json:"boom"`
}

// Custom error to return in case of a JSON parsing error
type JSONError struct {
	Message string `json:"Message"`
}

// The current module (stateful)
var CurrentModule Module

// Max metrics entry saved in cache, currently 24h with 1 log per second
const MaxCache int = 86400

// Path of the mocked analog system
const AnalogFilePath = "/etc/analog-mock.json"
//const AnalogFilePath = "../analog-mock.json"

var Analog, _ = os.OpenFile(AnalogFilePath, os.O_CREATE|os.O_SYNC|os.O_RDONLY, os.ModePerm)

// Read the analog file & unmarchal metric (or return the error)
func readJSONMetric() (metric Metric) {
	Analog.Sync()

	metric = Metric{}

	byteValue, _ := ioutil.ReadFile(AnalogFilePath)
	parseErr := json.Unmarshal(byteValue, &metric)
	if parseErr != nil {
		log.Println("Error Unmarshal : ")
		log.Println(parseErr)
		//log.Fatal(parseErr)
	}

	return
}

// Add a metric to the current module's cache
func appendMetric(metric Metric) {

	// if metric is the same
	if metric.Timestamp.Equal(CurrentModule.LastMetrics[0].Timestamp) {
		return
	}

	// boom detected
	if metric.Boom {
		log.Println("Boom initiated")
		// Write empty JSON {} to simulate explosion (useful in case of a reload)
		encoder := json.NewEncoder(Analog)
		encoder.Encode("{}")
		os.Exit(0)
	}

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
	delta, _ := time.ParseDuration("-1s")
	timestamp = timestamp.Add(delta)

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
		log.Println("Write OK error")
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
func getLastMetricRoutine(done <-chan bool) {
	ticker := time.NewTicker(1 * time.Second)
	go func() {
		for {
			select {
			case <-done:
				ticker.Stop()
				return
			case <-ticker.C:

				// Get last metric writes
				last := readJSONMetric()
				appendMetric(last)
			}
		}
	}()
}


func main() {
	// If there is a seed variable set in env
	if os.Getenv("SEED") != "" {
		seed, err := strconv.ParseInt(os.Getenv("SEED"), 10, 64)
		if err != nil {
			log.Println("Seed error")
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

	defer Analog.Close()

	CurrentModule = Module{LastMetrics: make([]Metric, 0, MaxCache)}

	// CRON to read metric every second
	analogTicker := make(chan bool, 1)
	getLastMetricRoutine(analogTicker)

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
