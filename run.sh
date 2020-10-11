#!/bin/bash

YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Mission Commander -> I have to perform a go/no go poll${NC}"
curl --silent http://localhost/mission/poll/initiate -X POST

echo -e "\n"

echo -e "${YELLOW}Weather Officer -> I have to check the weather status${NC}"
curl --silent http://localhost/weather/status -X GET

echo -e "\n"

echo -e "${YELLOW}Weather Officer -> I have to respond to Mission Commander${NC}"
curl --silent http://localhost/weather/poll/respond -H "Content-type:application/json" -X POST -d "{\"ready\": true}"

echo -e "\n"

echo -e "${YELLOW}Chief Rocket Department -> I have to check the rocket status${NC}"
curl --silent http://localhost/rocket/status -X GET

echo -e "\n"

echo -e "${YELLOW}Chief Rocket Department -> I have to respond to Mission Commander${NC}"
curl --silent http://localhost/rocket/poll/respond -H "Content-type:application/json" -X POST -d "{\"ready\": true}"

echo -e "\n"

echo -e "${YELLOW}Mission Commander -> I have to send the go to the chief rocket department${NC}"
curl --silent http://localhost/mission/poll/mission -H "Content-type:application/json" -X POST -d "{\"ready\": true}"

echo -e "\n"

echo -e "${YELLOW}Chief Rocket Department -> I have launch the rocket${NC}"
curl --silent http://localhost/rocket/launch -X POST

echo -e "\n"

echo -e "${YELLOW}Chief Rocket department -> I want to stage the rocket mid-flight, it will be done automatically when fuel is at 0% (I can also do it manually but I won't)${NC}"

echo ""

echo -e "${YELLOW}Chief Payload department -> I want to deliver the payload by setting the altitude to deliver payload (I can also drop it manually but I won't)${NC}"
curl --silent http://localhost/rocket/detach-payload/altitude -H "Content-type:application/json" -X POST -d "{\"altitude\": 140}"

echo -e "\n\nWaiting for the telemetry to get every data from launch (~30secs)"

sleep 30

echo -e "${YELLOW}Telemetry Officer -> I want to check the telemetry of the launch${NC}"
curl --silent http://localhost/telemetry/rocket-metrics/null/null -X GET
