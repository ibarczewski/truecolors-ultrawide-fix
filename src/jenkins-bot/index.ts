import { Bot } from '../common/Bot';
import { BotFramework } from '../common/BotFramework';
import fetch from 'node-fetch';
import {
  taskCreatedTemplate,
  TaskCreatedTemplateData
} from '../common/templates/TaskCreated';
import { WebexCard } from '../common/WebexCard';

const framework = new BotFramework('jenkins', process.env.JENKINS_BOT_TOKEN);

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

framework.router.post('/:roomId', (req, res) => {
  const bot: Bot = framework.getBotByRoomId(req.params.roomId);
  if (bot) {
    try {
      const { name, build } = req.body;
      const data = {
        projectName: name,
        title: `Job ${build.phase}`,
        metadata: [
          {
            key: 'Build number:',
            value: `[${build.number}](${build.full_url})`
          },
          { key: 'Status:', value: build.status }
        ],
        actions: [
          {
            type: 'Action.OpenUrl',
            title: 'Open in Jenkins',
            url: build.full_url
          }
        ]
      } as TaskCreatedTemplateData;
      const jobCompletedNotification = new WebexCard(taskCreatedTemplate, data);
      jobCompletedNotification.send(bot);
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('could not find bot');
  }

  res.end();
});

export default framework;
