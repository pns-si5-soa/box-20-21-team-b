#!/usr/bin/env bash

echo Test Rocket service..
./healthcheck_service.sh http://localhost/rocket/ok

echo Test Mission service..
./healthcheck_service.sh http://localhost/mission/ok

echo Test Weather service..
./healthcheck_service.sh http://localhost/weather/ok

echo Test Webcaster service..
./healthcheck_service.sh http://localhost/Webcaster/ok