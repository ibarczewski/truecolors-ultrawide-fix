import {
  sendJenkinsWebhookURLUseCase,
  sendJobCompletedSuccessNotificationUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobQueuedNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase,
  sendJobCompletedFinalizedNotificationUseCase,
  sendJobStartedNotificationUseCase
} from '../useCases';
import JenkinsCardFormController from './JenkinsCardFormController';
import JenkinsNotificationController from './JenkinsNotificationController';

const jenkinsNotificationController = new JenkinsNotificationController(
  sendJobCompletedSuccessNotificationUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobQueuedNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase,
  sendJobCompletedFinalizedNotificationUseCase,
  sendJobStartedNotificationUseCase
);

const jenkinsCardFormController = new JenkinsCardFormController(
  sendJenkinsWebhookURLUseCase
);

export { jenkinsNotificationController, jenkinsCardFormController };
