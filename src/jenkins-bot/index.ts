import { Router } from 'express';
import { Bot } from '../common/Bot';
import { BotFramework } from '../common/BotFramework';
import {
  JobCompletedNotification,
  JobCompletedNotificationData
} from './JobCompletedNotification/JobCompletedNotification';
import fetch from 'node-fetch';

const router = Router();

const framework = new BotFramework(
  'jenkins',
  process.env.JENKINS_BOT_TOKEN,
  router
);

framework.hears('hello', (bot) => {
  bot.say('world');
});

framework.hears('demo job completed', (bot) => {
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
});

const jobCompletedNotification = new JobCompletedNotification();

router.post('/:roomId', (req, res) => {
  const bot: Bot = framework.getBotByRoomId(req.params.roomId);
  if (bot) {
    try {
      const { name, build } = req.body;
      jobCompletedNotification.send(bot, {
        buildUrl: build.full_url,
        jobName: name,
        number: build.number,
        phase: build.phase,
        status: build.status
      } as JobCompletedNotificationData);
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('could not find bot');
  }

  res.end();
});

export { router, framework };
