#!/bin/bash
WEBHOOK=$1
cp seedjob-template.groovy seedjob.groovy
sed -i "" "s|WEBHOOK_URL|$1|g" seedjob.groovy

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