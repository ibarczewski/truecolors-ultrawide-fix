import {
  sendJenkinsWebhookURLUseCase,
  sendJobCompletedNotificationUseCase,
  sendJobFailedNotificationUseCase
} from '../useCases';
import JenkinsCardFormController from './JenkinsCardFormController';
import JenkinsNotificationController from './JenkinsNotificationController';

const jenkinsNotificationController = new JenkinsNotificationController(
  sendJobCompletedNotificationUseCase,
  sendJobFailedNotificationUseCase
);

const jenkinsCardFormController = new JenkinsCardFormController(
  sendJenkinsWebhookURLUseCase
);

export { jenkinsNotificationController, jenkinsCardFormController };
