package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"io"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"
)

var (
	altitudeGauge = promauto.NewGauge(prometheus.GaugeOpts{
		Namespace:   "boxb",
		Subsystem:   "module_metrics",
		Name:        "altitude",
		Help:        "Altitude metric",
	})

	fuelGauge = promauto.NewGauge(prometheus.GaugeOpts{
		Namespace:   "boxb",
		Subsystem:   "module_metrics",
		Name:        "fuel",
		Help:        "Fuel metric",
	})

	pressureGauge = promauto.NewGauge(prometheus.GaugeOpts{
		Namespace:   "boxb",
		Subsystem:   "module_metrics",
		Name:        "pressure",
		Help:        "Pressure metric",
	})

	speedGauge = promauto.NewGauge(prometheus.GaugeOpts{
		Namespace:   "boxb",
		Subsystem:   "module_metrics",
		Name:        "speed",
		Help:        "Speed metric",
	})

	latitudeGauge = promauto.NewGauge(prometheus.GaugeOpts{
		Namespace:   "boxb",
		Subsystem:   "module_metrics",
		Name:        "latitude",
		Help:        "Latitude metric",
	})

	longitudeGauge = promauto.NewGauge(prometheus.GaugeOpts{
		Namespace:   "boxb",
		Subsystem:   "module_metrics",
		Name:        "longitude",
		Help:        "Longitude metric",
	})
)

// A module representation
type Module struct {
	Id          int
	LastMetrics []Metric // Cache of last 24 hours of log (1 per second)
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

var AnalogFile, _ = os.OpenFile(AnalogFilePath, os.O_CREATE|os.O_SYNC|os.O_RDONLY, os.ModePerm)

// Read the analog file & unmarchal metric (or return the error)
func readJSONMetric() (metric Metric) {
	AnalogFile.Sync()

	metric = Metric{}

	byteValue, _ := ioutil.ReadFile(AnalogFilePath)
	parseErr := json.Unmarshal(byteValue, &metric)
	if parseErr != nil {
		//log.Println("Error Unmarshal : ")
		//log.Println(parseErr)
		//log.Fatal(parseErr)
	}

	return
}



// Add a metric to the current module's cache
func appendMetric(metric Metric) {
	//log.Println(metric)

	// if metric is the same
	if len(CurrentModule.LastMetrics) != 0 && metric.Timestamp.Equal(CurrentModule.LastMetrics[0].Timestamp) {
		//log.Println("No new Metric")
		return
	}

	log.Print("New Metric reads : ")
	log.Println(metric)

	// boom detected
	if metric.IsBoom {
		log.Println("Boom initiated")
		// Write empty JSON {} to simulate explosion (useful in case of a reload)
		encoder := json.NewEncoder(AnalogFile)
		encoder.Encode("{}")
		os.Exit(0)
	}

	// If the cache is full (24 hours of logs with 1 log / second), pop the last entry (FIFO)
	if len(CurrentModule.LastMetrics) == MaxCache {
		CurrentModule.LastMetrics = CurrentModule.LastMetrics[:len(CurrentModule.LastMetrics)-1]
	}

	// Add the current metric at the first place (FIFO)
	CurrentModule.LastMetrics = append([]Metric{metric}, CurrentModule.LastMetrics...)

	// Publish metrics
	altitudeGauge.Set(float64(metric.Altitude))
	fuelGauge.Set(float64(metric.Fuel))
	pressureGauge.Set(float64(metric.Pressure))
	speedGauge.Set(float64(metric.Speed))
	latitudeGauge.Set(float64(metric.Latitude))
	longitudeGauge.Set(float64(metric.Longitude))
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
	if len(CurrentModule.LastMetrics) == 0 {
		json.NewEncoder(w).Encode("{}")
		return
	}

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

	// Retrieve the ID of the Module
	var idModule int
	if idModule, _ = strconv.Atoi(os.Getenv("ID_MODULE")); idModule == 0 {
		log.Println("Error : no IdModule provided. Exit")
		os.Exit(-1)
	}
	CurrentModule.Id = idModule

	defer AnalogFile.Close()

	CurrentModule = Module{LastMetrics: make([]Metric, 0, MaxCache)}

	// CRON to read metric every second
	analogTicker := make(chan bool, 1)
	getLastMetricRoutine(analogTicker)

	// Create a new router to serve routes
	router := mux.NewRouter()

	// All the routes of the app
	router.HandleFunc("/module-metrics/ok", ok).Methods("GET")
	router.Handle("/module-metrics/metrics", promhttp.Handler())
	router.HandleFunc("/module-metrics/metrics/{timestamp}", metrics).Methods("GET")

	fmt.Println("Server is running on port " + port)

	// Start the server
	log.Fatal(http.ListenAndServe(":"+port, router))
}
