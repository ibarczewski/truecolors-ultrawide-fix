import {
  sendJenkinsWebhookURLUseCase,
  sendJobCompletedSuccessNotificationUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobStartedNotificationUseCase,
  sendJobQueuedNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase,
  sendJobFinalizedNotificationUseCase,
  retryJenkinsBuildUseCase
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
  sendJenkinsWebhookURLUseCase,
  retryJenkinsBuildUseCase
);

export { jenkinsNotificationController, jenkinsCardFormController };
