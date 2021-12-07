import { Bot } from '../../common/Bot';
import BotApplication from '../../common/BotApplication';
import BotCardFormController from '../../common/BotCardFormController';
import SendJenkinsWebhookURLUseCase from '../useCases/SendJenkinsWebhookURL';

export default class JenkinsCardFormController
  implements BotCardFormController
{
  private sendJenkinsWebhookURL: SendJenkinsWebhookURLUseCase;
  constructor(sendJenkinsWebhookURL: SendJenkinsWebhookURLUseCase) {
    this.sendJenkinsWebhookURL = sendJenkinsWebhookURL;
  }
  execute(body, botApplication: BotApplication) {
    const webex = botApplication.getWebexSDK();
    const bot: Bot = botApplication.getBotByRoomId(body.data.roomId);
    if (webex) {
      webex.attachmentActions
        .get(body.data.id)
        .then((message) => {
          if (message.inputs.id === 'setJenkinsConfig') {
            this.sendJenkinsWebhookURL.execute(
              {
                roomId: message.inputs.roomId,
                settingsEnvelopeId: body.data.id
              },
              bot
            );
          }
        })
        .catch((err) => {});
    }
  }
}
