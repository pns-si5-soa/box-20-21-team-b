#!/bin/bash

YELLOW='\033[0;33m'
Cyan="\033[0;36m"
NC='\033[0m' # No Color

echo -e "${YELLOW}Mission Commander -> I have to perform a go/no go poll for rocket 2${NC}"
echo -e "${Cyan}It will send a POST request on the mission service and the poll event will be send on the bus${NC}"
curl --silent http://localhost/mission/poll/initiate -H "Content-type:application/json" -X POST -d "{\"rocketId\": 2}"
echo -e "\n"

echo -e "${YELLOW}Weather Officer -> I have to check the weather status${NC}"
echo -e "${Cyan}It will send a GET request on the weather service ${NC}"
curl --silent http://localhost/weather/status -X GET
echo -e "\n"

echo -e "${YELLOW}Weather Officer -> I have to respond to Mission Commander for rocket 2${NC}"
echo -e "${Cyan}It will send a POST request on the weather service and the poll response event will be send on the bus${NC}"
curl --silent http://localhost/weather/poll/respond -H "Content-type:application/json" -X POST -d "{\"ready\": true, \"rocketId\": 2}"
echo -e "\n"

echo -e "${YELLOW}Chief Rocket Department -> I have to check the rocket status${NC}"
echo -e "${Cyan}It will send a GET request on the rocket service ${NC}"
curl --silent http://localhost/rocket/status -X GET
echo -e "\n"

echo -e "${YELLOW}Chief Rocket Department -> I have to respond to Mission Commander for rocket 2${NC}"
echo -e "${Cyan}It will send a POST request on the rocket service and the poll response event will be send on the bus${NC}"
curl --silent http://localhost/rocket/poll/respond -H "Content-type:application/json" -X POST -d "{\"ready\": true, \"rocketId\": 2}"
echo -e "\n"

echo -e "${YELLOW}Mission Commander -> I have to send the go to the chief rocket department for rocket 2${NC}"
echo -e "${Cyan}It will send a POST request on the mission service and the launch order event will be send on the bus${NC}"
curl --silent http://localhost/mission/poll/mission -H "Content-type:application/json" -X POST -d "{\"ready\": true, \"rocketId\": 2}"
echo -e "\n"

echo -e "${YELLOW}Chief Rocket Department -> I have to launch the rocket 2${NC}"
echo -e "${Cyan}It will send a POST request on the rocket service. The gRPC connection is used to start each rocket module${NC}"
curl --silent http://localhost/rocket/launch -H "Content-type:application/json" -X POST -d "{\"rocketId\": 2}"
echo -e "\n"

sleep 4

echo -e "${YELLOW}Chief Rocket department -> I want to stage the rocket mid-flight for rocket 2, it will be done automatically when fuel is at a given percent (for the booster it will keep some fuel to land)${NC}"

echo ""

echo -e "${YELLOW}Chief Payload department -> I want to deliver the payload by setting the altitude to deliver payload for rocket 2 (I can also drop it manually but I won't)${NC}"
curl --silent http://localhost/rocket/actions/set-altitude-to-detach -H "Content-type:application/json" -X POST -d "{\"value\": 1900, \"rocketId\": 1, \"moduleId\": 3}"
echo -e "\n"

echo -e "${YELLOW}Telemetry Officer -> I want to check the telemetry of the launch for rocket 2${NC}"

for i in `seq 1 4`;
do
        timestampStart=$( date "+%Y-%m-%dT%H:%M:%S.%3NZ" -d '- 1 hours - 10 seconds')
        timestampEnd=$( date "+%Y-%m-%dT%H:%M:%S.%3NZ" -d '- 1 hours')
        echo -e "\nAltitude of the rocket 2 for the 10 last seconds"
        curl --silent -G --data-urlencode "query=boxb_module_metrics_altitude{job=\"module-metrics2\"}" --data-urlencode "start=${timestampStart}"  --data-urlencode "end=${timestampEnd}"  --data-urlencode "step=1s"  "http://localhost:9090/api/v1/query_range" -X GET
        sleep 1
        echo -e "\n\nSpeed of the rocket 2 for the 10 last seconds"
        curl --silent -G --data-urlencode "query=boxb_module_metrics_speed{job=\"module-metrics2\"}" --data-urlencode "start=${timestampStart}"  --data-urlencode "end=${timestampEnd}"  --data-urlencode "step=1s"  "http://localhost:9090/api/v1/query_range" -X GET
        sleep 1
        echo -e "\n\nFuel of the rocket 2 for the 10 last seconds"
        curl --silent -G --data-urlencode "query=boxb_module_metrics_fuel{job=\"module-metrics2\"}" --data-urlencode "start=${timestampStart}"  --data-urlencode "end=${timestampEnd}"  --data-urlencode "step=1s"  "http://localhost:9090/api/v1/query_range" -X GET
        sleep 1
        echo -e "\n\nPressure of the rocket 2 for the 10 last seconds"
        curl --silent -G --data-urlencode "query=boxb_module_metrics_pressure{job=\"module-metrics2\"}" --data-urlencode "start=${timestampStart}"  --data-urlencode "end=${timestampEnd}"  --data-urlencode "step=1s"  "http://localhost:9090/api/v1/query_range" -X GET

        if [ "$i" -ne 3 ]
        then
          echo -e "\n\nWaiting for the next metrics"
          sleep 6
        fi
done

echo -e "\n\nHere we got a big latency issue between the detection of alert and the trigger"

sleep 20

echo -e "\n\nThe rocket went boom you can press Control + C"