#!/usr/bin/env bash

echo "Build all local images with docker-compose..."
docker-compose build
echo "Build finished !"

echo "Configure local"
kubec