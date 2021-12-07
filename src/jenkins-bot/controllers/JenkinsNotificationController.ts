import { Request } from 'express';
import { Bot } from '../../common/Bot';
import BotApplication from '../../common/BotApplication';
import JenkinsRestAPIService from '../services/JenkinsAPIService';
import SendJobCompletedNotificationUseCase from '../useCases/SendJobCompletedNotification';

interface JenkinsNotificationSCM {
  url: string;
  branch: string;
  commit: string;
}

interface JenkinsNotificationBuild {
  full_url: string;
  number: number;
  phase: 'QUEUED' | 'STARTED' | 'COMPLETED' | 'FINALIZED';
  status: 'SUCCESS' | 'FAILED';
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
  constructor(
    sendJobCompletedNotificationUseCase: SendJobCompletedNotificationUseCase
  ) {
    this.sendJobCompletedNotificationUseCase =
      sendJobCompletedNotificationUseCase;
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
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('could not find bot');
    }

    res.end();
  }
}
