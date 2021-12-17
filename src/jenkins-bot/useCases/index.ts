import { TaskCreatedTemplate } from '../../common/templates/TaskCreated';
import JenkinsConfigurationTemplate from '../templates/Configuration';
import SendJenkinsConfigurationFormUseCase from './SendJenkinsConfigurationForm';
import SendJenkinsWebhookURLUseCase from './SendJenkinsWebhookURL';
import SendJobCompletedSuccessNotificationUseCase from './SendJobCompletedSuccessNotification';
import SendJobCompletedFailureNotificationUseCase from './SendJobCompletedFailureNotification';
import SendJobQueuedNotificationUseCase from './SendJobQueuedNotification';
import JobCompletedTemplate from '../templates/JobCompletedTemplate';
import SendJobCompletedPartiallyFailedNotificationUseCase from './SendJobCompletedPartiallyFailedNotification';
<<<<<<< HEAD
import SendJobCompletedFinalizedNotificationUseCase from './SendJobCompletedFinalizedNotification';
=======
import SendJobStartedNotificationUseCase from './SendJobStartedNotification';
>>>>>>> 97e7a4b (SPARK-287107 - added job started to the notification controller - IB SS)

const taskCreatedTemplate = new TaskCreatedTemplate();
const configTemplate = new JenkinsConfigurationTemplate();
const jobCompletedTemplate = new JobCompletedTemplate();

const sendJobCompletedSuccessNotificationUseCase =
  new SendJobCompletedSuccessNotificationUseCase(jobCompletedTemplate);

const sendJenkinsConfigurationFormUseCase =
  new SendJenkinsConfigurationFormUseCase(configTemplate);

const sendJobCompletedFailureNotificationUseCase =
  new SendJobCompletedFailureNotificationUseCase(jobCompletedTemplate);

const sendJobQueuedNotificationUseCase = new SendJobQueuedNotificationUseCase(
  taskCreatedTemplate
);

const sendJobCompletedPartiallyFailedNotificationUseCase =
  new SendJobCompletedPartiallyFailedNotificationUseCase(taskCreatedTemplate);

const sendJobCompletedFinalizedNotificationUseCase =
  new SendJobCompletedFinalizedNotificationUseCase(taskCreatedTemplate);
const sendJobStartedNotificationUseCase = new SendJobStartedNotificationUseCase(taskCreatedTemplate);

const sendJenkinsWebhookURLUseCase = new SendJenkinsWebhookURLUseCase();

export {
  sendJobCompletedSuccessNotificationUseCase,
  sendJenkinsConfigurationFormUseCase,
  sendJenkinsWebhookURLUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobQueuedNotificationUseCase,
  sendJobCompletedPartiallyFailedNotificationUseCase,
  sendJobCompletedFinalizedNotificationUseCase
  sendJobStartedNotificationUseCase
};
