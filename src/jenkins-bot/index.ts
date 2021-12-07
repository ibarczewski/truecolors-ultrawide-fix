import BotApplication from '../common/BotApplication';
import { jenkinsCardFormController } from './controllers';
import { handlers } from './handlers';
import { routes } from './routes';

const jenkinsBot = new BotApplication(
  'jenkins',
  process.env.JENKINS_BOT_TOKEN,
  jenkinsCardFormController,
  routes,
  handlers
);

export default jenkinsBot;
