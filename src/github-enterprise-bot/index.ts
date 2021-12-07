import BotApplication from '../common/BotApplication';
import { handlers } from './handlers';
import { routes } from './routes';

const framework = new BotApplication(
  'github',
  process.env.GITHUB_BOT_TOKEN,
  null,
  routes,
  handlers
);

export default framework;
