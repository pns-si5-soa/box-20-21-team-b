package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

// A module representation
type Module struct {
	Id         int
	LastEvents []Event
}

// A event representation
type Event struct {
	Timestamp   time.Time `json:"timestamp"`
	IdModule    int       `json:"idModule"`
	Label       string    `json:"label"`
	Initiator   string    `json:"initiator"`
	Description string    `json:"description"`
}

// Custom error to return in case of a JSON parsing error
type JSONError struct {
	Message string `json:"Message"`
}

// The current module (stateful)
var CurrentModule Module

// Path of the mocked event system
const EventFilePath = "/etc/event-mock.json"
var EventFile, _ = os.OpenFile(EventFilePath, os.O_CREATE|os.O_SYNC|os.O_RDONLY, os.ModePerm)

// Read the analog file & unmarchal event (or return the error)
func readJSONEvents() (events []Event) {
	EventFile.Sync()

	events = make([]Event, 0)

	byteValue, _ := ioutil.ReadFile(EventFilePath)
	parseErr := json.Unmarshal(byteValue, &events)
	if parseErr != nil {
		log.Println("Error Unmarshal : ")
		log.Println(parseErr)
		//log.Fatal(parseErr)
	}

	return
}

// Merge the new list of events to the current module's cache
func appendEvents(events []Event) {
	// If no new events
	if len(CurrentModule.LastEvents) == len(events) {
		return
	}

	CurrentModule.LastEvents = events
}

// Return all the events newer than the timestamp
func getEventsFromTimestamp(timestamp time.Time) []Event {
	eventsFrom := make([]Event, 0)
	delta, _ := time.ParseDuration("-1s")
	timestamp = timestamp.Add(delta)

	for i := len(CurrentModule.LastEvents) - 1; i > 0; i-- {
		if CurrentModule.LastEvents[i].Timestamp.After(timestamp) {
			eventsFrom = append(eventsFrom, CurrentModule.LastEvents[i])
		} else {
			return eventsFrom
		}
	}

	return eventsFrom
}

// Basic OK route for healthcheck
func ok(w http.ResponseWriter, req *http.Request) {
	_, err := io.WriteString(w, "ok")
	if err != nil {
		log.Println("Write OK error")
		log.Fatal(err)
	}
}

// List the events after a given timestamp
func events(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(req)
	var listEvents []Event // List of events to return

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
	listEvents = getEventsFromTimestamp(timestamp)

	// Return logs as a JSON object
	jsonError := json.NewEncoder(w).Encode(listEvents)
	if jsonError != nil {
		e := JSONError{Message: "Internal Server Error"}
		w.WriteHeader(http.StatusInternalServerError)
		err2 := json.NewEncoder(w).Encode(e)
		log.Panic(err, err2)
	}
}

// List all the events
func allEvents(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Return logs as a JSON object
	err := json.NewEncoder(w).Encode(CurrentModule.LastEvents)
	if err != nil {
		e := JSONError{Message: "Internal Server Error"}
		w.WriteHeader(http.StatusInternalServerError)
		err2 := json.NewEncoder(w).Encode(e)
		log.Panic(err, err2)
	}
}

// Generate & add a random event every 1 second
func getLastEventsRoutine(done <-chan bool) {
	ticker := time.NewTicker(1 * time.Second)
	go func() {
		for {
			select {
			case <-done:
				ticker.Stop()
				return
			case <-ticker.C:

				// Get last event writes
				appendEvents(readJSONEvents())
			}
		}
	}()
}

func main() {
	// If there is a port variable set in env
	var port string
	if port = os.Getenv("PORT"); port == "" {
		port = "3006"
	}

	// Retrieve the ID of the Module
	var idModule int
	if idModule, _ = strconv.Atoi(os.Getenv("ID_MODULE")); idModule == 0 {
		log.Println("Error : no IdModule provided. Exit")
		os.Exit(-1)
	}
	CurrentModule.Id = idModule

	defer EventFile.Close()

	CurrentModule = Module{LastEvents: make([]Event, 0)}

	// CRON to read event every second
	eventTicker := make(chan bool, 1)
	getLastEventsRoutine(eventTicker)

	// Create a new router to serve routes
	router := mux.NewRouter()

	// All the routes of the app
	router.HandleFunc("/module-events/ok", ok).Methods("GET")
	router.HandleFunc("/module-events/events", allEvents).Methods("GET")
	router.HandleFunc("/module-events/events/{timestamp}", events).Methods("GET")

	fmt.Println("Server is running on port " + port)

	// Start the server
	log.Fatal(http.ListenAndServe(":"+port, router))
}
