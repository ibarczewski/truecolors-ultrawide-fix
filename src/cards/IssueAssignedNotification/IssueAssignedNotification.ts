import { BaseCard } from '../BaseCard';
import IssueAssignedNotificationTemplate from './IssueAssignedNotificationTemplate.json';

export type IssueAssignedNotificationData = {
  repositoryName: string;
  repositoryURL: string;
  assigneeName: string;
  assigneeURL: string;
  assignedByName: string;
  assignedByURL: string;
  issueNumber: number;
  issueTitle: string;
  issueURL: string;
};

export class IssueAssignedNotification extends BaseCard<IssueAssignedNotificationData> {
  protected static template = IssueAssignedNotificationTemplate;
}
