import {
  sendJenkinsWebhookURLUseCase,
  sendJobCompletedSuccessNotificationUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobStartedNotificationUseCase,
  sendJobQueuedNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase,
  sendJobFinalizedNotificationUseCase
} from '../useCases';
import JenkinsCardFormController from './JenkinsCardFormController';
import JenkinsNotificationController from './JenkinsNotificationController';

const jenkinsNotificationController = new JenkinsNotificationController(
  sendJobCompletedSuccessNotificationUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobQueuedNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase,
  sendJobFinalizedNotificationUseCase,
  sendJobStartedNotificationUseCase
);

const jenkinsCardFormController = new JenkinsCardFormController(
  sendJenkinsWebhookURLUseCase
);

export { jenkinsNotificationController, jenkinsCardFormController };
