# Github Enterprise Bot

## Prerequisites:

- [ ] node.js and nvm - type  `nvm use` in this repo to configure
- [ ] Sign up for Webex Teams (logged in with your web browser)

----

## Steps to get the bot working

1. Create a Webex Teams bot (save the API access token and username): https://developer.webex.com/my-apps/new/bot

2. run `npx localtunnel --port 7001 --subdomain [yoursubdomain]`
 
3. Copy the ip address displayed in the localtunnel window, ie: https://[yoursubdomain].local.lt

4. Copy the `config-template.json` file to a file called `config.json`

5. Edit  `config.json` with the following values:

* token - Set this to the token for your bot that you got in step 1
* port - Set this to the port you set when you started localtunnel in step 3 (ie: 7001)
* webhookUrl - Set this to the ip address that you copied in step 4

6. Turn on your bot server with ```npm start```

7. Create a space in Webex Teams

8. Add the bot (by its username) to the space in Webex Teams

9. `@[yourbotname] get webhook url` in the space to get the webhook url

10. set that webhook url in github enterprise
