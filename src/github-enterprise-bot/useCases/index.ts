import { taskCreatedTemplate } from '../../common/templates';
import SendIssueAssignedNotificationUseCase from './SendIssueAssignedNotification';
import SendPullRequestOpenedNotificationUseCase from './SendPullRequestOpenedNotification';

const sendIssueAssignedNotificationUseCase =
  new SendIssueAssignedNotificationUseCase(taskCreatedTemplate);

const sendPullRequestOpenedUseCase =
  new SendPullRequestOpenedNotificationUseCase(taskCreatedTemplate);

export { sendIssueAssignedNotificationUseCase, sendPullRequestOpenedUseCase };
