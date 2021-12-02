# Github Enterprise Bot

## Prerequisites:

- [ ] node.js and nvm - type  `nvm use` in this repo to configure
- [ ] Sign up for Webex Teams (logged in with your web browser)

----

## Steps to get the bot working

1. Create a Webex Teams bot (save the API access token and username): https://developer.webex.com/my-apps/new/bot

2. run `npx localtunnel --port 7001 --subdomain [yoursubdomain]`
 
3. Copy the ip address displayed in the localtunnel window, ie: https://[yoursubdomain].loca.lt

4. Copy the `.env.example` file to a file called `.env`

5. Edit `.env` with the following values:

* FRAMEWORK_TOKEN - Set this to the token for your bot that you got in step 1
* PORT - Set this to the port you set when you started localtunnel in step 2 (ie: 7001)
* FRAMEWORK_WEBHOOK_URL - Set this to the ip address that you copied in step 3

6. Turn on your bot server with ```npm start```

7. Create a space in Webex Teams

8. Add the bot (by its username) to the space in Webex Teams

9. `@[yourbotname] get webhook url` in the space to get the webhook url

10. set that webhook url in github enterprise


## Deploy to vm (ec2)

- copy Bot-PoC.pem to deploy/ec2 folder
- `git pull` the latest code of the branch that you want to deploy
- run `nvm use` to set your runtime
- `npm run deploy:ec2:dev` or `npm run deploy:ec2:qa`

The ec2 is a vm running pm2 and the localtunnel services should be running.
- qa domain is ghbotqa.loca.lt port is 8001
- dev domain is ghbotdev.loca.lt port is 7001

ssh to vm with `ssh -i ./deploy/ec2/Bot-PoC.pem ec2-user@ec2-18-235-1-183.compute-1.amazonaws.com`
### Some helpful commands when ssh'd into the vm
- `pm2 list` -> get all the running services
- `pm2 restart github-bot-dev-localtunnel` -> restarts the localtunnel service (only needed if something is not working)
- `pm2 logs {name_of_service}` -> displays the logs of the service currently running in real time. PID will also work instead of the service name.


## Test Utils
`npm run test-util "{command}"` 
- e.g. `npm run test-util "open pull request"`

### Prerequisites

- environment variables in .env
- - GITHUB_ACCESS_TOKEN={personal access token from [access token settings](https://sqbu-github.cisco.com/settings/tokens/new?scopes=repo) }
- - TEST_GIT_REPO={ssh address of github enterprise repo for testing}
- ssh access to TEST_GIT_REPO

### Development

`npm run dev:test-utils`
