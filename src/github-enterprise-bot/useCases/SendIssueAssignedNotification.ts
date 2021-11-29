import { Bot } from '../../common/Bot';
import {
  TaskCreatedTemplate,
  TaskCreatedTemplateData
} from '../../common/templates/TaskCreated';

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
  private template: TaskCreatedTemplate;
  constructor(template: TaskCreatedTemplate) {
    this.template = template;
  }
  execute(request: SendIssueAssignedNotificationDTO, bot: Bot) {
    const data: TaskCreatedTemplateData = {
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
    };

    const issueAssignedCard = this.template.buildCard(data);
    bot.sendCard(issueAssignedCard);
  }
}
