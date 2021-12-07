import { BotRoute } from '../common/BotApplication';
import { githubEnterpriseWebhookController } from './controllers';

export const routes: BotRoute[] = [
  {
    action: 'post',
    path: '/:roomId',
    controller: githubEnterpriseWebhookController
  }
];
