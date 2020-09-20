cd ../service-weather

docker build -t blueorigin/service-weather .

cd ../service-rocket

docker build -t blueorigin/service-rocket .

cd ../service-mission

docker build -t blueorigin/service-mission .

cd ../docker
docker-compose up -d
