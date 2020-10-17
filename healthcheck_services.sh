#!/usr/bin/env bash
tries=0
default_service=rocket
if [[ "$1" != "" ]]; then
    default_service=$1
fi

host=http://localhost/$default_service/ok

echo "Backend server $host healthcheck..."

while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' $host)" != "200" ]]; do
        ((tries=tries+1))
        echo "$tries try..."
        sleep 15
        if [ $tries -eq 12 ];
        then
                echo "Timeout"
                exit 1
        fi
done
echo "Server UP"
