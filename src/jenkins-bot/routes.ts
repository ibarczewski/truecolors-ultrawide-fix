import { BotRoute } from '../common/BotApplication';
import { jenkinsNotificationController } from './controllers';

export const routes: BotRoute[] = [
  {
    action: 'post',
    path: '/:roomId',
    controller: jenkinsNotificationController
  },
  {
    action: 'post',
    path: '/:roomId/:settingsEnvelopeID',
    controller: jenkinsNotificationController
  }
];
