import {
  sendJenkinsWebhookURLUseCase,
  sendJobCompletedSuccessNotificationUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobQueuedStartedNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase,
  sendJobCompletedFinalizedNotificationUseCase,
} from '../useCases';
import JenkinsCardFormController from './JenkinsCardFormController';
import JenkinsNotificationController from './JenkinsNotificationController';

const jenkinsNotificationController = new JenkinsNotificationController(
  sendJobCompletedSuccessNotificationUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobQueuedStartedNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase,
  sendJobCompletedFinalizedNotificationUseCase,
);

const jenkinsCardFormController = new JenkinsCardFormController(
  sendJenkinsWebhookURLUseCase
);

export { jenkinsNotificationController, jenkinsCardFormController };
