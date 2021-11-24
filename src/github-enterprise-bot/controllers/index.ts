import { sendIssueAssignedNotificationUseCase } from '../useCases';
import IssueAssignedEventController from './IssueAssignedEventController';

const issueAssignedEventController = new IssueAssignedEventController(
  sendIssueAssignedNotificationUseCase
);

export { issueAssignedEventController };
