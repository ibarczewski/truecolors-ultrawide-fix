import { TaskCreatedTemplate } from '../../common/templates/TaskCreated';
import JenkinsConfigurationTemplate from '../templates/Configuration';
import SendJenkinsConfigurationFormUseCase from './SendJenkinsConfigurationForm';
import SendJenkinsWebhookURLUseCase from './SendJenkinsWebhookURL';
import SendJobCompletedSuccessNotificationUseCase from './SendJobCompletedSuccessNotification';
import SendJobCompletedFailureNotificationUseCase from './SendJobCompletedFailureNotification';
import SendJobQueuedNotificationUseCase from './SendJobQueuedStartedNotification';
import JobCompletedTemplate from '../templates/JobCompletedTemplate';
import SendJobCompletedPartiallyFailedNotificationUseCase from './SendJobCompletedPartiallyFailedNotification';
import SendJobCompletedFinalizedNotificationUseCase from './SendJobCompletedFinalizedNotification';

const taskCreatedTemplate = new TaskCreatedTemplate();
const configTemplate = new JenkinsConfigurationTemplate();
const jobCompletedTemplate = new JobCompletedTemplate();

const sendJobCompletedSuccessNotificationUseCase =
  new SendJobCompletedSuccessNotificationUseCase(jobCompletedTemplate);

const sendJenkinsConfigurationFormUseCase =
  new SendJenkinsConfigurationFormUseCase(configTemplate);

const sendJobCompletedFailureNotificationUseCase =
  new SendJobCompletedFailureNotificationUseCase(jobCompletedTemplate);

const sendJobQueuedStartedNotificationUseCase = new SendJobQueuedNotificationUseCase(
  taskCreatedTemplate
);

const sendJobCompletedPartiallyFailedNotificationUseCase =
  new SendJobCompletedPartiallyFailedNotificationUseCase(taskCreatedTemplate);

const sendJobCompletedFinalizedNotificationUseCase =
  new SendJobCompletedFinalizedNotificationUseCase(taskCreatedTemplate);

const sendJenkinsWebhookURLUseCase = new SendJenkinsWebhookURLUseCase();

export {
  sendJobCompletedSuccessNotificationUseCase,
  sendJenkinsConfigurationFormUseCase,
  sendJenkinsWebhookURLUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobQueuedStartedNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase,
  sendJobCompletedFinalizedNotificationUseCase
};
