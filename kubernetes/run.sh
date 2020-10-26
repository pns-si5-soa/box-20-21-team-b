#!/bin/bash

kubectl apply -f kafka-service.yml
kubectl apply -f kafka-deployment.yml

kubectl apply -f weather-deployment.yml
kubectl apply -f weather-service.yml

kubectl apply -f zookeeper-deployment.yml
kubectl apply -f zookeeper-service.yml