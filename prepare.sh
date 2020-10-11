docker-compose up -d --build
echo "All services started. Start healthchecks.."
./healthcheck_services.sh
echo "Healthcheck done. All done."
