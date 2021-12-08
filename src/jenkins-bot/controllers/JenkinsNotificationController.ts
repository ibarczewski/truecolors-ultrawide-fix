import { Request } from 'express';
import { Bot } from '../../common/Bot';
import BotApplication from '../../common/BotApplication';
import JenkinsRestAPIService from '../services/JenkinsAPIService';
import SendJobCompletedSuccessNotificationUseCase from '../useCases/SendJobCompletedSuccessNotification';
import SendJobCompletedFailureNotificationUseCase from '../useCases/SendJobCompletedFailureNotification';
import { JenkinsJobPhase } from '../useCases/JenkinsJobPhase';
import { JenkinsJobStatus } from '../useCases/JenkinsJobStatus';

interface JenkinsNotificationSCM {
  url: string;
  branch: string;
  commit: string;
}
interface JenkinsNotificationBuild {
  full_url: string;
  number: number;
  phase: JenkinsJobPhase;
  status: JenkinsJobStatus;
  url: string;
  scm: JenkinsNotificationSCM;
  artifacts: any; // complex object where keys are probably only known by admin
}

interface JenkinsNotificationPayload {
  name: string;
  url: string;
  build: JenkinsNotificationBuild;
}

export default class JenkinsNotificationController {
  private sendJobCompletedSuccessNotificationUseCase: SendJobCompletedSuccessNotificationUseCase;
  private sendJobCompletedFailureNotificationUseCase: SendJobCompletedFailureNotificationUseCase;
  constructor(
    sendJobCompletedNotificationUseCase: SendJobCompletedSuccessNotificationUseCase,
    sendJobCompletedFailureNotificationUseCase: SendJobCompletedFailureNotificationUseCase
  ) {
    this.sendJobCompletedSuccessNotificationUseCase =
      sendJobCompletedNotificationUseCase;

    this.sendJobCompletedFailureNotificationUseCase =
      sendJobCompletedFailureNotificationUseCase;
  }
  async execute(
    req: Request<
      { roomId: string; settingsEnvelopeID?: string },
      {},
      JenkinsNotificationPayload
    >,
    res,
    botApplication: BotApplication
  ) {
    const bot: Bot = botApplication.getBotByRoomId(req.params.roomId);
    if (bot) {
      try {
        const { name, build } = req.body;
        let numberOfGitChanges;
        if (req.params.settingsEnvelopeID) {
          const jenkinsAPI = new JenkinsRestAPIService(
            req.params.settingsEnvelopeID,
            botApplication.getWebexSDK()
          );

          ({ numberOfGitChanges } = await jenkinsAPI.getBuildData(
            build.full_url
          ));
        }

        switch (build.phase) {
          case JenkinsJobPhase.COMPLETED:
            switch (build.status) {
              case JenkinsJobStatus.FAILURE:
                await this.sendJobCompletedFailureNotificationUseCase.execute(
                  {
                    jobName: name,
                    buildNumber: build.number,
                    buildPhase: build.phase,
                    buildStatus: build.status,
                    buildURL: build.full_url
                  },
                  bot
                );
                break;
              case JenkinsJobStatus.SUCCESS:
                await this.sendJobCompletedSuccessNotificationUseCase.execute(
                  {
                    jobName: name,
                    buildNumber: build.number,
                    buildPhase: build.phase,
                    buildStatus: build.status,
                    buildURL: build.full_url,
                    numberOfGitChanges
                  },
                  bot
                );
                break;
              default:
                break;
            }
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
