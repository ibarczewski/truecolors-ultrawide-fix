import { BotHandler } from '../common/BotApplication';

export const handlers: BotHandler[] = [
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
