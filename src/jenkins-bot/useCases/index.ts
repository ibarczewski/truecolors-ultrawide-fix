import { TaskCreatedTemplate } from '../../common/templates/TaskCreated';
import JenkinsConfigurationTemplate from '../templates/Configuration';
import SendJenkinsConfigurationFormUseCase from './SendJenkinsConfigurationForm';
import SendJenkinsWebhookURLUseCase from './SendJenkinsWebhookURL';
import SendJobCompletedNotificationUseCase from './SendJobCompletedNotification';

const taskCreatedTemplate = new TaskCreatedTemplate();
const configTemplate = new JenkinsConfigurationTemplate();

const sendJobCompletedNotificationUseCase =
  new SendJobCompletedNotificationUseCase(taskCreatedTemplate);

const sendJenkinsConfigurationFormUseCase =
  new SendJenkinsConfigurationFormUseCase(configTemplate);

const sendJenkinsWebhookURLUseCase = new SendJenkinsWebhookURLUseCase();

export {
  sendJobCompletedNotificationUseCase,
  sendJenkinsConfigurationFormUseCase,
  sendJenkinsWebhookURLUseCase
};
