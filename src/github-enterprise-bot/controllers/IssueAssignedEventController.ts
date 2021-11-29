import { IssuesAssignedEvent } from '@octokit/webhooks-types';
import { Request } from 'express';
import { Bot } from '../../common/Bot';
import SendIssueAssignedNotificationUseCase, {
  SendIssueAssignedNotificationDTO
} from '../useCases/SendIssueAssignedNotification';

export default class IssueAssignedEventController {
  private useCase: SendIssueAssignedNotificationUseCase;
  constructor(useCase: SendIssueAssignedNotificationUseCase) {
    this.useCase = useCase;
  }
  execute(req: Request<{}, {}, IssuesAssignedEvent>, res, bot: Bot) {
    const { issue, sender, assignee, repository } = req.body;
    const dto: SendIssueAssignedNotificationDTO = {
      repositoryName: repository.name,
      repositoryUrl: repository.html_url,
      assigneeName: assignee.login,
      assigneeUrl: assignee.html_url,
      assignedByName: sender.login,
      assignedByUrl: sender.html_url,
      issueNumber: issue.number,
      issueTitle: issue.title,
      issueUrl: issue.html_url
    };
    this.useCase.execute(dto, bot);
    res.end();
  }
}
