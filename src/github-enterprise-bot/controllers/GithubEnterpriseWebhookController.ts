import { Bot } from '../../common/Bot';
import { BotFramework, BotRouteController } from '../../common/BotFramework';
import { Request, Response } from 'express';
import { WebhookEvent as GithubWebhookEvent } from '@octokit/webhooks-types';

type GithubWebhookRequest = Request<{ roomId: string }, {}, GithubWebhookEvent>;

export default class GithubEnterpriseWebhookController
  implements BotRouteController
{
  private issueAssignedEventController;

  constructor(issueAssignedEventController) {
    this.issueAssignedEventController = issueAssignedEventController;
  }

  private isIssueAssignedEvent = (event: GithubWebhookEvent): boolean => {
    return 'action' in event && 'issue' in event && event.action === 'assigned';
  };

  execute(req: GithubWebhookRequest, res: Response, framework: BotFramework) {
    const bot: Bot = framework.getBotByRoomId(req.params.roomId);
    if (bot) {
      try {
        switch (true) {
          case this.isIssueAssignedEvent(req.body):
            this.issueAssignedEventController.execute(req, res, bot);
            break;
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
