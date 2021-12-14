import {
  sendJenkinsWebhookURLUseCase,
  sendJobCompletedSuccessNotificationUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobQueuedNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase
} from '../useCases';
import JenkinsCardFormController from './JenkinsCardFormController';
import JenkinsNotificationController from './JenkinsNotificationController';

const jenkinsNotificationController = new JenkinsNotificationController(
  sendJobCompletedSuccessNotificationUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobQueuedNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase
);

const jenkinsCardFormController = new JenkinsCardFormController(
  sendJenkinsWebhookURLUseCase
);

export { jenkinsNotificationController, jenkinsCardFormController };
