import { Request } from 'express';
import { Bot } from '../../common/Bot';
import BotApplication from '../../common/BotApplication';
import JenkinsRestAPIService from '../services/JenkinsAPIService';
import SendJobCompletedNotificationUseCase from '../useCases/SendJobCompletedNotification';
import SendJobFailedNotificationUseCase from '../useCases/SendJobFailedNotification';

enum JenkinsJobPhase {
  QUEUED = 'QUEUED',
  STARTED = 'QUEUED',
  COMPLETED = 'COMPLETED',
  FINALIZED = 'FINALIZED'
}

enum JenkinsJobStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

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
  private sendJobCompletedNotificationUseCase: SendJobCompletedNotificationUseCase;
  private sendJobFailedNotificationUseCase: SendJobFailedNotificationUseCase;
  constructor(
    sendJobCompletedNotificationUseCase: SendJobCompletedNotificationUseCase,
    sendJobFailedNotificationUseCase: SendJobFailedNotificationUseCase
  ) {
    this.sendJobCompletedNotificationUseCase =
      sendJobCompletedNotificationUseCase;

    this.sendJobFailedNotificationUseCase = sendJobFailedNotificationUseCase;
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

        if (build.status === JenkinsJobStatus.FAILED) {
          await this.sendJobFailedNotificationUseCase.execute(
            {
              jobName: name,
              buildNumber: build.number,
              buildPhase: build.phase,
              buildStatus: build.status,
              buildURL: build.full_url
            },
            bot
          );
        } else {
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

          await this.sendJobCompletedNotificationUseCase.execute(
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
