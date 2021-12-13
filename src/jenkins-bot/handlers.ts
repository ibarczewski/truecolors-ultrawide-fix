import { BotHandler } from '../common/BotApplication';
import fetch from 'node-fetch';
import { sendJenkinsConfigurationFormUseCase } from './useCases';

export const handlers: BotHandler[] = [
  {
    command: 'hello',
    handler: (bot) => {
      bot.say('world');
    }
  },
  {
    command: 'demo job completed success',
    handler: (bot) => {
      try {
        // NOTE: using node-fetch here to use our app end to end (rather than simply sending a card directly)
        fetch(`${process.env.FRAMEWORK_WEBHOOK_URL}/jenkins/${bot.room.id}`, {
          method: 'post',
          body: JSON.stringify({
            build: {
              full_url: 'https://google.com/',
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
    command: 'demo job completed failure',
    handler: (bot) => {
      try {
        // NOTE: using node-fetch here to use our app end to end (rather than simply sending a card directly)
        fetch(`${process.env.FRAMEWORK_WEBHOOK_URL}/jenkins/${bot.room.id}`, {
          method: 'post',
          body: JSON.stringify({
            build: {
              full_url: 'https://google.com/',
              number: 4,
              phase: 'COMPLETED',
              status: 'FAILURE'
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
    command: 'demo job queued',
    handler: (bot) => {
      try {
        // NOTE: using node-fetch here to use our app end to end (rather than simply sending a card directly)
        fetch(`${process.env.FRAMEWORK_WEBHOOK_URL}/jenkins/${bot.room.id}`, {
          method: 'post',
          body: JSON.stringify({
            build: {
              full_url: 'https://google.com/',
              number: 4,
              phase: 'QUEUED'
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
  },
  {
    command: 'configure',
    handler: (bot, trigger) => {
      sendJenkinsConfigurationFormUseCase.execute(trigger.person.id, bot);
    }
  }
];
