import { Bot } from '../common/Bot';
import { BotFramework, BotHandler, BotRoute } from '../common/BotFramework';
import fetch from 'node-fetch';
import { TaskCreatedTemplateData } from '../common/templates/TaskCreated';
import { taskCreatedTemplate } from '../common/templates';

const jenkinsEventController = {
  execute: (req, res, framework) => {
    const bot: Bot = framework.getBotByRoomId(req.params.roomId);
    if (bot) {
      try {
        const { name, build } = req.body;
        const data: TaskCreatedTemplateData = {
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
        };

        const jobCompletedCard = taskCreatedTemplate.buildCard(data);
        bot.sendCard(jobCompletedCard);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('could not find bot');
    }

    res.end();
  }
};

const routes: BotRoute[] = [
  {
    action: 'post',
    path: '/:roomId',
    controller: jenkinsEventController
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
  }
];

const framework = new BotFramework(
  'jenkins',
  process.env.JENKINS_BOT_TOKEN,
  routes,
  handlers
);

export default framework;
