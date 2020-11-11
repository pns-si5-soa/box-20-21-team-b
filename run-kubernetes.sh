#!/usr/bin/env bash
echo "Please make sure you have done prepare-kubernetes.sh before !"

echo "Creating Namespace..."
kubectl create namespace boxb
echo "Namespace boxb created !"

echo "Applying configuration from folder 'kubernetes' in current namespace"
kubectl -n boxb apply -f kubernetes
echo "Configuration applied. Please wait until all resources are correctly started"

echo "Sleep 10..."

echo "Start 'manual' healtchecks of services..."
#dos2unix *.sh
./healthcheck_all_services.sh
echo "All healtchecks done. Enjoy ! (or RIP if its not working I guess)"