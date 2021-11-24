import { Bot } from '../../common/Bot';
import {
  TaskCreatedTemplateData,
  taskCreatedTemplate
} from '../../common/templates/TaskCreated';
import { WebexCard } from '../../common/WebexCard';

export default class SendIssueAssignedNotificationUseCase {
  execute(
    request: {
      repositoryName: string;
      repositoryUrl: string;
      assigneeName: string;
      assigneeUrl: string;
      assignedByName: string;
      assignedByUrl: string;
      issueNumber: number;
      issueTitle: string;
      issueUrl: string;
    },
    bot: Bot
  ) {
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

    const issueAssignedNotification = new WebexCard(
      taskCreatedTemplate,
      data,
      bot
    );
    issueAssignedNotification.send();
  }
}
