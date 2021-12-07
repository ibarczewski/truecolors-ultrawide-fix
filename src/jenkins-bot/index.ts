import { BotFramework, BotHandler, BotRoute } from '../common/BotFramework';
import fetch from 'node-fetch';
import { jenkinsNotificationController } from './controllers';

const routes: BotRoute[] = [
  {
    action: 'post',
    path: '/:roomId',
    controller: jenkinsNotificationController
  }
];

const handlers: BotHandler[] = [
  {
    command: 'hello',
    handler: (bot) => {
      bot.say('world');
    }
  },
  {
    command: 'demo job completed',
    handler: (bot) => {
      try {
        // NOTE: using node-fetch here to use our app end to end (rather than simply sending a card directly)
        fetch(`${process.env.FRAMEWORK_WEBHOOK_URL}/jenkins/${bot.room.id}`, {
          method: 'post',
          body: JSON.stringify({
            build: {
              full_url: 'https://google.com',
              number: 3,
              phase: 'COMPLETED',
              status: 'SUCCESS'
            },
            name: 'fake jenkins job name'
          }),
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        console.log(e);
      }
    }
  },
  {
    command: 'get webhook url',
    handler: (bot) => {
      bot.say(`${process.env.FRAMEWORK_WEBHOOK_URL}/jenkins/${bot.room.id}`);
    }
  }
];

const framework = new BotFramework(
  'jenkins',
  process.env.JENKINS_BOT_TOKEN,
  routes,
  handlers
);

export default framework;
