import { Router } from 'express';
import { BotFramework } from '../common/BotFramework';
import { Bot } from '../common/Bot';
import {
  sendTaskCompletedNotification,
  TaskCompletedNotificationData
} from './cards/IssueAssignedNotification/TaskCompletedNotification';

const router = Router();

const framework = new BotFramework(
  'github',
  process.env.GITHUB_BOT_TOKEN,
  router
);

// example shared handler
// framework.use(commonHelpFunction('please'));

framework.hears('hello', (bot) => {
  bot.say('world');
});

framework.hears('get webhook url', (bot) => {
  try {
    bot.say(
      `your webhook url is ${process.env.FRAMEWORK_WEBHOOK_URL}/github/${bot.room.id}`
    );
  } catch (error) {
    console.log(error);
  }
});

router.post('/:roomId', (req, res) => {
  const bot: Bot = framework.getBotByRoomId(req.params.roomId);
  if (bot) {
    try {
      const { issue, sender, assignee, repository } = req.body;

      sendTaskCompletedNotification(bot, {
        projectName: `[${repository.name}](${repository.html_url})`,
        title: `Issue assigned to [${assignee.login}](${assignee.html_url})`,
        metadata: [
          {
            key: 'Assigned by:',
            value: `[${sender.login}](${sender.html_url})`
          },
          {
            key: 'Issue:',
            value: `[#${issue.number} - ${issue.title}](${issue.html_url})`
          }
        ]
      } as TaskCompletedNotificationData);
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('could not find bot');
  }

  res.end();
});

export { router };
