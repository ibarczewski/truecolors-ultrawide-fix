import { Router } from 'express';
import { BotFramework } from '../common/BotFramework';

const router = Router();

const framework = new BotFramework(
  'jenkins',
  process.env.JENKINS_BOT_TOKEN,
  router
);

framework.hears('hello', (bot) => {
  bot.say('world');
});

export { router, framework };
