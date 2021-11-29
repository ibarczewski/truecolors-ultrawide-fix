import { taskCreatedTemplate } from '../../common/templates';
import SendIssueAssignedNotificationUseCase from './SendIssueAssignedNotification';

const sendIssueAssignedNotificationUseCase =
  new SendIssueAssignedNotificationUseCase(taskCreatedTemplate);

export { sendIssueAssignedNotificationUseCase };
