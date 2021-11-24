import { BotFramework } from '../common/BotFramework';
import { issueAssignedEventController } from './controllers';
import GithubEnterpriseWebhookController from './controllers/GithubEnterpriseWebhookController';

const framework = new BotFramework('github', process.env.GITHUB_BOT_TOKEN);

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

const githubEnterpriseWebhookController = new GithubEnterpriseWebhookController(
  framework,
  issueAssignedEventController
);

framework.router.post('/:roomId', (req, res) =>
  githubEnterpriseWebhookController.execute(req, res)
);

export default framework;
