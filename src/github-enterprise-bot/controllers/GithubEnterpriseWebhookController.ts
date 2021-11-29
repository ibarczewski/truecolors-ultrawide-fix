import { Bot } from '../../common/Bot';
import { BotFramework } from '../../common/BotFramework';
import { Request, Response } from 'express';
import { WebhookEvent } from '@octokit/webhooks-types';

type GithubWebhookRequest = Request<{ roomId: string }, {}, WebhookEvent>;

enum GithubEventType {
  ISSUE_ASSIGNED
}

export default class GithubEnterpriseWebhookController {
  private framework;
  private issueAssignedEventController;

  constructor(framework: BotFramework, issueAssignedEventController) {
    this.framework = framework;
    this.issueAssignedEventController = issueAssignedEventController;
  }

  private getEventType(req) {
    if (!!req.body.issue && req.body.action === 'assigned') {
      return GithubEventType.ISSUE_ASSIGNED;
    }
  }

  execute(req: GithubWebhookRequest, res: Response) {
    const bot: Bot = this.framework.getBotByRoomId(req.params.roomId);
    if (bot) {
      try {
        const eventType = this.getEventType(req);
        switch (eventType) {
          case GithubEventType.ISSUE_ASSIGNED:
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
