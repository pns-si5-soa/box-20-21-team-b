# Blue Origin X

Blue Origin X project for the "Service Oriented Architecture" course.

## Members

Masia Sylvain  
Montoya Damien  
Peres Richard  
Rigaut François

## Architecture
[Services architecture](https://docs.google.com/drawings/d/1nPwjdThcmIOF9405_RnOB57g_V54kWaU8bnyY00sa-E/edit?usp=sharing)  

## Technology
[Node.js 12.18.3](https://nodejs.org/en/)  
[Golang](https://golang.org/)  
[MongoDB](https://www.mongodb.com/)  
[NestJs](https://nestjs.com/)  
[Docker](https://www.docker.com/)  
[Prometheus](https://grafana.com/)  

## Run the project

First of all you need to download Docker. Then run the scrip `prepare.sh`. 
The script will create each container for each service and make healthchecks. 
After this step you can run the `run.sh` fil eto have a demonstration.

## Access tools

Get to `http://grafana.localhost/` to access grafana with username `boxb` and password `boxb`

You can also check Prometheus by getting to `http://prometheus.localhost/`

## Setup a project with NestJs

First you need to download Node.js. Then run the following command `npm i -g @nestjs/cli`. In the folder where you want to start a project type `nest new project-name`



