import { Bot } from '../../common/Bot';
import BotApplication, {
  BotRouteController
} from '../../common/BotApplication';
import { Request, Response } from 'express';
import {
  IssuesAssignedEvent,
  PullRequestEvent,
  WebhookEvent as GithubWebhookEvent
} from '@octokit/webhooks-types';

type GithubWebhookRequest<EventType = GithubWebhookEvent> = Request<
  { roomId: string },
  {},
  EventType
>;

interface GithubEventController<EventType> {
  execute(req: GithubWebhookRequest<EventType>, res: Response, bot: Bot): void;
}

export default class GithubEnterpriseWebhookController
  implements BotRouteController
{
  private issueAssignedEventController: GithubEventController<IssuesAssignedEvent>;
  private pullRequestEventController: GithubEventController<PullRequestEvent>;

  constructor(
    issueAssignedEventController: GithubEventController<IssuesAssignedEvent>,
    pullRequestEventController: GithubEventController<PullRequestEvent>
  ) {
    this.issueAssignedEventController = issueAssignedEventController;
    this.pullRequestEventController = pullRequestEventController;
  }

  private isIssueAssignedEvent = (event: GithubWebhookEvent): boolean => {
    return 'action' in event && 'issue' in event && event.action === 'assigned';
  };

  private isPullRequestEvent = (event: GithubWebhookEvent): boolean => {
    return 'pull_request' in event;
  };

  execute(
    req: GithubWebhookRequest,
    res: Response,
    botApplication: BotApplication
  ) {
    const bot: Bot = botApplication.getBotByRoomId(req.params.roomId);
    if (bot) {
      try {
        switch (true) {
          case this.isIssueAssignedEvent(req.body):
            this.issueAssignedEventController.execute(
              req as GithubWebhookRequest<IssuesAssignedEvent>,
              res,
              bot
            );
            break;
          case this.isPullRequestEvent(req.body):
            this.pullRequestEventController.execute(
              req as GithubWebhookRequest<PullRequestEvent>,
              res,
              bot
            );
          default:
            break;
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('could not find bot');
    }

    res.end();
  }
}
