import { Bot } from '../../common/Bot';
import { TaskCreatedTemplateData } from '../../common/templates/TaskCreated';
import { Template } from '../../common/templates/Template';
import { WebexCard } from '../../common/WebexCard';

export interface SendIssueAssignedNotificationDTO {
  repositoryName: string;
  repositoryUrl: string;
  assigneeName: string;
  assigneeUrl: string;
  assignedByName: string;
  assignedByUrl: string;
  issueNumber: number;
  issueTitle: string;
  issueUrl: string;
}

export default class SendIssueAssignedNotificationUseCase {
  private template;
  constructor(template: Template<TaskCreatedTemplateData>) {
    this.template = template;
  }
  execute(request: SendIssueAssignedNotificationDTO, bot: Bot) {
    const data = {
      projectName: `[${request.repositoryName}](${request.repositoryUrl})`,
      title: `Issue assigned to [${request.assigneeName}](${request.assigneeUrl})`,
      metadata: [
        {
          key: 'Assigned by:',
          value: `[${request.assignedByName}](${request.assignedByUrl})`
        },
        {
          key: 'Issue:',
          value: `[#${request.issueNumber} - ${request.issueTitle}](${request.issueUrl})`
        }
      ]
    } as TaskCreatedTemplateData;

    const issueAssignedNotification = new WebexCard(this.template, data);
    issueAssignedNotification.send(bot);
  }
}
