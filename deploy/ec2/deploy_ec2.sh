#!/bin/bash

if [ -z "$1" ]
  then
    echo "No environment supplied - e.g. sh deploy/ec2/deploy_ec2 dev"
    exit 1;
fi

npm install
npm run build
npm run bundle
rsync -azp --delete --progress -e 'ssh -i ./deploy/ec2/Bot-PoC.pem' ./dist/ ec2-user@ec2-18-235-1-183.compute-1.amazonaws.com:/home/ec2-user/github-bot/$1 --exclude=.env 

# restart if running, otherwise start it
if ssh -i ./deploy/ec2/Bot-PoC.pem ec2-user@ec2-18-235-1-183.compute-1.amazonaws.com "pm2 restart github-bot-$1"; then
    echo "$1 restarted";
else
    ssh -i ./deploy/ec2/Bot-PoC.pem ec2-user@ec2-18-235-1-183.compute-1.amazonaws.com "cd github-bot/$1; pm2 start 'node index.js' --name github-bot-$1";
    echo "$1 started"
fi;

