import {
  sendJenkinsWebhookURLUseCase,
  sendJobCompletedNotificaitonUseCase
} from '../useCases';
import JenkinsCardFormController from './JenkinsCardFormController';
import JenkinsNotificationController from './JenkinsNotificationController';

const jenkinsNotificationController = new JenkinsNotificationController(
  sendJobCompletedNotificaitonUseCase
);

const jenkinsCardFormController = new JenkinsCardFormController(
  sendJenkinsWebhookURLUseCase
);

export { jenkinsNotificationController, jenkinsCardFormController };
