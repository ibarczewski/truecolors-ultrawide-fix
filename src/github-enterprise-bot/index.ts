import { Router } from 'express';
import {
  IssueAssignedNotification,
  IssueAssignedNotificationData
} from './cards/IssueAssignedNotification/IssueAssignedNotification';
import { BotFramework } from '../common/BotFramework';
import { Bot } from '../common/Bot';

// import { commonHelpFunction } from '../common/handlers';

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

const issueAssignedNotification = new IssueAssignedNotification();

router.post('/:roomId', (req, res) => {
  const bot: Bot = framework.getBotByRoomId(req.params.roomId);
  if (bot) {
    try {
      const { issue, sender, assignee, repository } = req.body;
      issueAssignedNotification.send(bot, {
        assignedByName: sender.login,
        assignedByURL: sender.html_url,
        assigneeName: assignee.login,
        assigneeURL: assignee.html_url,
        issueNumber: issue.number,
        issueTitle: issue.title,
        issueURL: issue.html_url,
        repositoryURL: repository.html_url,
        repositoryName: repository.name
      } as IssueAssignedNotificationData);
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('could not find bot');
  }

  res.end();
});

export { router };
