# Blue Origin X

Blue Origin X project for the "Service Oriented Architecture" course.

## Members

Masia Sylvain - 100 points  
Montoya Damien - 100 points  
Peres Richard - 100 points  
Rigaut François - 100 points  

## Démonstration finale
### Pré-requis
- Docker  
- Port 80 et 8080 accessibles (et 9090 pour les besoins de la démo uniquement)  
- Internet  
- Il peut être nécessaire de `dos2unix *.sh` afin d'éviter tout problème d'encodage des scripts sh


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
[Node.js](https://nodejs.org/en/)  
[Golang](https://golang.org/)  
[MongoDB](https://www.mongodb.com/)  
[NestJs](https://nestjs.com/)  
[Docker](https://www.docker.com/)  
[Grafana](https://grafana.com/)  
[Prometheus](https://prometheus.io)  
[Kubernetes <3](https://kubernetes.io)  

## Run the project

First of all you need to download Docker. Then run the script `prepare.sh`. 
The script will create each container for each service and make healthchecks. 
After this step you can run the `run.sh` file to have a demonstration.

```
$ ./prepare.sh  
$ ./run.sh  
```

## Access tools

Get to `http://grafana.localhost/` to access grafana with username `boxb` and password `boxb`

You can also check Prometheus by getting to `http://prometheus.localhost/`


## BONUS : Run Kubernetes

```
$ ./prepare-kubernetes.sh  
$ ./run-kubernetes.sh  
```

This will load all the current resources (mostly Deploys, Pods, Services & Ingress) located in the `kubernetes` folder.

!! WARNING !! this is for enjoyment purpose only, not all the services are covered yet so the `run.sh` will not work for example.

Enjoy :)
