#!/bin/bash

#docker attach boxb-kafka

docker attach webcaster &
P1=$!
./run_rocket_1.sh &
P2=$!
wait $P1 $P2
