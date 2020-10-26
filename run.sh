#!/bin/bash

YELLOW='\033[0;33m'
Cyan="\033[0;36m"
NC='\033[0m' # No Color

echo -e "${YELLOW}Mission Commander -> I have to perform a go/no go poll${NC}"
echo -e "${Cyan}It will send a POST request on the mission service and the poll event will be send on the bus${NC}"
curl --silent http://localhost/mission/poll/initiate -H "Content-type:application/json" -X POST -d "{\"rocketId\": 1}"

echo -e "\n"

echo -e "${YELLOW}Weather Officer -> I have to check the weather status${NC}"
echo -e "${Cyan}It will send a GET request on the weather service ${NC}"
curl --silent http://localhost/weather/status -X GET

echo -e "\n"

echo -e "${YELLOW}Weather Officer -> I have to respond to Mission Commander${NC}"
echo -e "${Cyan}It will send a POST request on the weather service and the poll response event will be send on the bus${NC}"
curl --silent http://localhost/weather/poll/respond -H "Content-type:application/json" -X POST -d "{\"ready\": true, \"rocketId\": 1}"

echo -e "\n"

echo -e "${YELLOW}Chief Rocket Department -> I have to check the rocket status${NC}"
echo -e "${Cyan}It will send a GET request on the rocket service ${NC}"
curl --silent http://localhost/rocket/status -X GET

echo -e "\n"

echo -e "${YELLOW}Chief Rocket Department -> I have to respond to Mission Commander${NC}"
echo -e "${Cyan}It will send a POST request on the rocket service and the poll response event will be send on the bus${NC}"
curl --silent http://localhost/rocket/poll/respond -H "Content-type:application/json" -X POST -d "{\"ready\": true, \"rocketId\": 1}"

echo -e "\n"

echo -e "${YELLOW}Mission Commander -> I have to send the go to the chief rocket department${NC}"
echo -e "${Cyan}It will send a POST request on the mission service and the launch order event will be send on the bus${NC}"
curl --silent http://localhost/mission/poll/mission -H "Content-type:application/json" -X POST -d "{\"ready\": true, \"rocketId\": 1}"

echo -e "\n"

echo -e "${YELLOW}Chief Rocket Department -> I have to launch the rocket${NC}"
echo -e "${Cyan}It will send a POST request on the rocket service. The gRPC connection is used to start each rocket module${NC}"
curl --silent http://localhost/rocket/launch -H "Content-type:application/json" -X POST -d "{\"rocketId\": 1}"

echo -e "\n"

echo -e "${YELLOW}Chief Rocket department -> I want to stage the rocket mid-flight, it will be done automatically when fuel is at a given percent (for the booster it will keep some fuel to land)${NC}"

echo ""

echo -e "${YELLOW}Chief Payload department -> I want to deliver the payload by setting the altitude to deliver payload (I can also drop it manually but I won't)${NC}"
curl --silent http://localhost/rocket/actions/set-altitude-to-detach -H "Content-type:application/json" -X POST -d "{\"value\": 1900, \"rocketId\": 1, \"moduleId\": 3}"

echo -e "\n\nWaiting for the telemetry to get every data from launch (~30secs) (see docker logs)"

sleep 30

#echo -e "${YELLOW}Telemetry Officer -> I want to check the telemetry of the launch${NC}"
#curl --silent http://localhost/telemetry/rocket-metrics -X GET

echo -e "\n\n${YELLOW}Chief Rocket Department -> I want to set the speed of the rocket a bit lower so that it can go through max Q harmlessly${NC}"
echo -e "${Cyan}It will send a POST request on the rocket service. The gRPC connection is used to change the spped of the module${NC}"
curl --silent http://localhost/rocket/actions/set-thrusters-speed -H "Content-type:application/json" -X POST -d "{\"value\": 100, \"rocketId\": 1}"


