import { TaskCreatedTemplate } from '../../common/templates/TaskCreated';
import JenkinsConfigurationTemplate from '../templates/Configuration';
import JobCompletedTemplate from '../templates/JobCompletedTemplate';
import SendJenkinsConfigurationFormUseCase from './SendJenkinsConfigurationForm';
import SendJenkinsWebhookURLUseCase from './SendJenkinsWebhookURL';
import SendJobCompletedFailureNotificationUseCase from './SendJobCompletedFailureNotification';
import SendJobCompletedPartiallyFailedNotificationUseCase from './SendJobCompletedPartiallyFailedNotification';
import SendJobCompletedSuccessNotificationUseCase from './SendJobCompletedSuccessNotification';
import SendJobFinalizedNotificationUseCase from './SendJobFinalizedNotification';
import SendJobQueuedNotificationUseCase from './SendJobQueuedNotification';
import SendJobStartedNotificationUseCase from './SendJobStartedNotification';

const taskCreatedTemplate = new TaskCreatedTemplate();
const configTemplate = new JenkinsConfigurationTemplate();
const jobCompletedTemplate = new JobCompletedTemplate();

const sendJenkinsConfigurationFormUseCase =
  new SendJenkinsConfigurationFormUseCase(configTemplate);

const sendJenkinsWebhookURLUseCase = new SendJenkinsWebhookURLUseCase();

const sendJobCompletedFailureNotificationUseCase =
  new SendJobCompletedFailureNotificationUseCase(jobCompletedTemplate);

const sendJobCompletedPartiallyFailedNotificationUseCase =
  new SendJobCompletedPartiallyFailedNotificationUseCase(taskCreatedTemplate);

const sendJobCompletedSuccessNotificationUseCase =
  new SendJobCompletedSuccessNotificationUseCase(jobCompletedTemplate);

const sendJobFinalizedNotificationUseCase =
  new SendJobFinalizedNotificationUseCase(taskCreatedTemplate);

const sendJobQueuedNotificationUseCase = new SendJobQueuedNotificationUseCase(
  taskCreatedTemplate
);

const sendJobStartedNotificationUseCase = new SendJobStartedNotificationUseCase(
  taskCreatedTemplate
);

export {
  sendJenkinsConfigurationFormUseCase,
  sendJenkinsWebhookURLUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase,
  sendJobCompletedSuccessNotificationUseCase,
  sendJobFinalizedNotificationUseCase,
  sendJobQueuedNotificationUseCase,
  sendJobStartedNotificationUseCase
};
