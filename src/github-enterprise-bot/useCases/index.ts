import { taskCreatedTemplate } from '../../common/templates/TaskCreated';
import SendIssueAssignedNotificationUseCase from './SendIssueAssignedNotification';

const sendIssueAssignedNotificationUseCase =
  new SendIssueAssignedNotificationUseCase(taskCreatedTemplate);

export { sendIssueAssignedNotificationUseCase };
