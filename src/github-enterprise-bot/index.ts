import { BotFramework, BotHandler, BotRoute } from '../common/BotFramework';
import { githubEnterpriseWebhookController } from './controllers';

const routes: BotRoute[] = [
  {
    action: 'post',
    path: '/:roomId',
    controller: githubEnterpriseWebhookController
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
    command: 'get webhook url',
    handler: (bot) => {
      try {
        bot.say(
          `your webhook url is ${process.env.FRAMEWORK_WEBHOOK_URL}/github/${bot.room.id}`
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
];

const framework = new BotFramework(
  'github',
  process.env.GITHUB_BOT_TOKEN,
  routes,
  handlers
);

export default framework;
