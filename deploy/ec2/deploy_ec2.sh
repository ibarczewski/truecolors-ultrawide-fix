#!/bin/bash

if [ -z "$1" ]
  then
    echo "No environment supplied - e.g. sh deploy/ec2/deploy_ec2 dev"
    exit 1;
fi

npm install
npm run build
npm run bundle
rsync -azp --delete --progress -e 'ssh -i ./deploy/ec2/Bot-PoC.pem' ./dist/ ec2-user@ec2-3-231-214-65.compute-1.amazonaws.com:/home/ec2-user/wwt-webex-bots/$1 --exclude=.env 

# restart if running, otherwise start it
if ssh -i ./deploy/ec2/Bot-PoC.pem ec2-user@ec2-3-231-214-65.compute-1.amazonaws.com "pm2 restart wwt-webex-bots-$1"; then
    echo "$1 restarted";
else
    ssh -i ./deploy/ec2/Bot-PoC.pem ec2-user@ec2-3-231-214-65.compute-1.amazonaws.com "cd wwt-webex-bots/$1; pm2 start 'node index.js' --name wwt-webex-bots-$1";
    echo "$1 started"
fi;

