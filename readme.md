# Blue Origin X

Blue Origin X project for the "Service Oriented Architecture" course.

## Members

Masia Sylvain - 100 points  
Montoya Damien - 100 points  
Peres Richard - 100 points  
Rigaut François - 100 points  

## Démonstration finale

Pour cette démonstration nous allons lancer deux fusées.  
Pour que ce soit plus compréhensible nous allons les lancer l'une après l'autre (bien entendu on pourrait les gérer en même temps).  
Pour la première fusée tout se déroulera très bien, de son lancement jusqu'à l'atterissage du booster.
La seconde fusée quant à elle recevra une alerte critique liée au maxQ et explosera en conséquence automatiquement pour ne pas foncer sur la lune.  

Les couleurs des logs :
- jaune -> indique l'us en cours
- bleu -> indique le cheminement des données
- vert -> affiche les logs de kafka
- blanc -> informatifs / données / retour de requête


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



