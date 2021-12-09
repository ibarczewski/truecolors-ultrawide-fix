import { TaskCreatedTemplate } from '../../common/templates/TaskCreated';
import JenkinsConfigurationTemplate from '../templates/Configuration';
import SendJenkinsConfigurationFormUseCase from './SendJenkinsConfigurationForm';
import SendJenkinsWebhookURLUseCase from './SendJenkinsWebhookURL';
import SendJobCompletedSuccessNotificationUseCase from './SendJobCompletedSuccessNotification';
import SendJobCompletedFailureNotificationUseCase from './SendJobCompletedFailureNotification';
import SendJobQueuedNotificationUseCase from './SendJobQueuedNotification';

const taskCreatedTemplate = new TaskCreatedTemplate();
const configTemplate = new JenkinsConfigurationTemplate();

const sendJobCompletedSuccessNotificationUseCase =
  new SendJobCompletedSuccessNotificationUseCase(taskCreatedTemplate);

const sendJenkinsConfigurationFormUseCase =
  new SendJenkinsConfigurationFormUseCase(configTemplate);

const sendJobCompletedFailureNotificationUseCase =
  new SendJobCompletedFailureNotificationUseCase(taskCreatedTemplate);

const sendJobQueuedNotificationUseCase = new SendJobQueuedNotificationUseCase(
  taskCreatedTemplate
);

const sendJenkinsWebhookURLUseCase = new SendJenkinsWebhookURLUseCase();

export {
  sendJobCompletedSuccessNotificationUseCase,
  sendJenkinsConfigurationFormUseCase,
  sendJenkinsWebhookURLUseCase,
  sendJobCompletedFailureNotificationUseCase,
  sendJobQueuedNotificationUseCase
};
