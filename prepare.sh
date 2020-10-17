docker-compose up -d --build
echo "All services started. Start healthchecks.."
./healthcheck_services.sh rocket
./healthcheck_services.sh mission
./healthcheck_services.sh weather
./healthcheck_services.sh telemetry
./healthcheck_services.sh webcaster
echo "Healthcheck done. All done."
