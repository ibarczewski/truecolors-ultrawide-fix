import { BotFramework, BotHandler, BotRoute } from '../common/BotFramework';
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
