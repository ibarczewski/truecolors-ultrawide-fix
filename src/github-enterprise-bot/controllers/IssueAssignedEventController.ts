import { Bot } from '../../common/Bot';
import SendIssueAssignedNotificationUseCase from '../useCases/sendIssueAssignedNotification';

export default class IssueAssignedEventController {
  private useCase: SendIssueAssignedNotificationUseCase;
  constructor(useCase: SendIssueAssignedNotificationUseCase) {
    this.useCase = useCase;
  }
  execute(req, res, bot: Bot) {
    const { issue, sender, assignee, repository } = req.body;
    this.useCase.execute(
      {
        repositoryName: repository.name,
        repositoryUrl: repository.html_url,
        assigneeName: assignee.login,
        assigneeUrl: assignee.html_url,
        assignedByName: sender.login,
        assignedByUrl: sender.html_url,
        issueNumber: issue.number,
        issueTitle: issue.title,
        issueUrl: issue.html_url
      },
      bot
    );
    res.end();
  }
}
