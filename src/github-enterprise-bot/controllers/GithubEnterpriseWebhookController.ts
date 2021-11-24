import { Bot } from '../../common/Bot';
import { BotFramework } from '../../common/BotFramework';

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

  private getEventType({ issue, action }) {
    if (!!issue && action === 'assigned') {
      return GithubEventType.ISSUE_ASSIGNED;
    }
  }

  execute(req, res) {
    const bot: Bot = this.framework.getBotByRoomId(req.params.roomId);
    if (bot) {
      try {
        const eventType = this.getEventType(req.body);
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
