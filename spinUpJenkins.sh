#!/bin/bash
if [ $# -eq 0 ]
  then
    echo "No arguments supplied to the spin up script. You must pass in a webhook url to inject into the Jenkins Notification plugin."
    exit 1
  elif [ -z "$1" ]
    then
    echo "Empty argument provided for the webhook URL. You must pass in a valid webhook url to inject into the Jenkins Notification plugin."
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
  echo "This script uses docker, and it isn't running - please start docker and try again."
  exit 1
fi

WEBHOOK=$1
cp seedjob-template.groovy seedjob.groovy
sed -i "" -e "s|WEBHOOK_URL|$1|g" seedjob.groovy

docker network rm jenkins || true
docker network create jenkins

docker stop jenkins-docker || true
docker stop jenkins-blueocean || true

docker run --name jenkins-docker --rm --detach \
  --privileged --network jenkins --network-alias docker \
  --env DOCKER_TLS_CERTDIR=/certs \
  --volume jenkins-docker-certs:/certs/client \
  --volume jenkins-data:/var/jenkins_home \
  --publish 2376:2376 docker:dind --storage-driver overlay2

docker build . -t myjenkins-blueocean:1.1 

docker run --name jenkins-blueocean --rm --detach \
  --network jenkins --env DOCKER_HOST=tcp://docker:2376 \
  --env DOCKER_CERT_PATH=/certs/client --env DOCKER_TLS_VERIFY=1 \
  --publish 8080:8080 --publish 50000:50000 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  myjenkins-blueocean:1.1

echo "Jenkins has been deployed, open http://localhost:8080 to access the instance."