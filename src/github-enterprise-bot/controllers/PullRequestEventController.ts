import { PullRequestEvent } from '@octokit/webhooks-types';
import { Request } from 'express';
import { Bot } from '../../common/Bot';

import SendPullRequestOpenedNotificationUseCase, {
  SendPullRequestCreatedNotificationDTO
} from '../useCases/SendPullRequestOpenedNotification';

export default class PullRequestEventController {
  private sendPullRequestOpenedUseCase: SendPullRequestOpenedNotificationUseCase;
  constructor(
    sendPullRequestOpenedUseCase: SendPullRequestOpenedNotificationUseCase
  ) {
    this.sendPullRequestOpenedUseCase = sendPullRequestOpenedUseCase;
  }
  execute(req: Request<{}, {}, PullRequestEvent>, res, bot: Bot) {
    const { sender, repository, pull_request, action } = req.body;
    if (action === 'opened') {
      const dto: SendPullRequestCreatedNotificationDTO = {
        repositoryName: repository.name,
        creatorName: sender.login,
        creatorURL: sender.html_url,
        pullRequestNumber: pull_request.number,
        pullRequestTitle: pull_request.title,
        pullRequestURL: pull_request.html_url,
        repositoryURL: repository.html_url
      };
      this.sendPullRequestOpenedUseCase.execute(dto, bot);
    }
    res.end();
  }
}
