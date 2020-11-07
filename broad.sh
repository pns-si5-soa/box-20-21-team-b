#!/bin/bash
echo "salut"

cd service-mission
$@
cd ..

cd service-rocket
$@
cd ..

cd service-weather
$@
cd ..
