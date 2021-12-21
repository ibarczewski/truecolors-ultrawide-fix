import { Bot } from '../../common/Bot';
import BotApplication from '../../common/BotApplication';
import BotCardFormController from '../../common/BotCardFormController';
import SendJenkinsWebhookURLUseCase from '../useCases/SendJenkinsWebhookURL';
import RetryJenkinsBuildUseCase from '../useCases/RetryJenkinsBuild';
import JenkinsRestAPIService from '../services/JenkinsAPIService';

export enum JenkinsAttachmentAction {
  SET_JENKINS_CONFIG = 'jenkins/attachmentActions/setJenkinsConfig',
  RETRY_BUILD = 'jenkins/attachmentActions/retryBuild'
}
export default class JenkinsCardFormController
  implements BotCardFormController
{
  private sendJenkinsWebhookURL: SendJenkinsWebhookURLUseCase;
  private retryJenkinsBuild: RetryJenkinsBuildUseCase;
  constructor(
    sendJenkinsWebhookURL: SendJenkinsWebhookURLUseCase,
    retryJenkinsBuild: RetryJenkinsBuildUseCase
  ) {
    this.sendJenkinsWebhookURL = sendJenkinsWebhookURL;
    this.retryJenkinsBuild = retryJenkinsBuild;
  }
  execute(body, botApplication: BotApplication) {
    const webex = botApplication.getWebexSDK();
    const bot: Bot = botApplication.getBotByRoomId(body.data.roomId);
    if (webex) {
      webex.attachmentActions
        .get(body.data.id)
        .then((message) => {
          switch (message.inputs.id) {
            case JenkinsAttachmentAction.SET_JENKINS_CONFIG:
              this.sendJenkinsWebhookURL.execute(
                {
                  roomId: message.inputs.roomId,
                  settingsEnvelopeId: body.data.id
                },
                bot
              );
              break;
            case JenkinsAttachmentAction.RETRY_BUILD:
              const jenkinsAPI = new JenkinsRestAPIService(
                message.inputs.envelopeId,
                webex
              );
              this.retryJenkinsBuild.execute({
                jenkinsAPI,
                jobName: message.inputs.jobName
              });
              break;
          }
        })
        .catch((err) => {});
    }
  }
}
