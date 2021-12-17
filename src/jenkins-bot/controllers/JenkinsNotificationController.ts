import { Request } from 'express';
import { Bot } from '../../common/Bot';
import BotApplication from '../../common/BotApplication';
import JenkinsRestAPIService from '../services/JenkinsAPIService';
import SendJobCompletedSuccessNotificationUseCase from '../useCases/SendJobCompletedSuccessNotification';
import SendJobCompletedFailureNotificationUseCase from '../useCases/SendJobCompletedFailureNotification';
import { JenkinsJobPhase } from '../useCases/JenkinsJobPhase';
import { JenkinsJobStatus } from '../useCases/JenkinsJobStatus';
import SendJobQueuedNotificationUseCase from '../useCases/SendJobQueuedNotification';
import { Commit } from '../templates/JobCompletedTemplate';
import SendJobCompletedPartiallyFailedNotificationUseCase from '../useCases/SendJobCompletedPartiallyFailedNotification';
import SendJobCompletedFinalizedNotificationUseCase from '../useCases/SendJobCompletedFinalizedNotification';
import SendJobStartedNotificationUseCase from '../useCases/SendJobStartedNotification';

interface JenkinsNotificationSCM {
  url: string;
  branch: string;
  commit: string;
  changes: any[];
}
interface JenkinsNotificationBuild {
  full_url: string;
  number: number;
  phase: JenkinsJobPhase;
  status?: JenkinsJobStatus;
  url: string;
  scm: JenkinsNotificationSCM;
  artifacts: any; // complex object where keys are probably only known by admin
}

export interface JenkinsNotificationPayload {
  name: string;
  url: string;
  build: JenkinsNotificationBuild;
}

export default class JenkinsNotificationController {
  private sendJobCompletedSuccessNotificationUseCase: SendJobCompletedSuccessNotificationUseCase;
  private sendJobCompletedFailureNotificationUseCase: SendJobCompletedFailureNotificationUseCase;
  private sendJobQueuedNotificationUseCase: SendJobQueuedNotificationUseCase;
  private sendJobCompletedPartiallyFailedNotificationUseCase: SendJobCompletedPartiallyFailedNotificationUseCase;
  private sendJobFinalizedNotificationUseCase: SendJobCompletedFinalizedNotificationUseCase;
  private sendJobStartedNotificationUseCase: SendJobStartedNotificationUseCase;

  constructor(
    sendJobCompletedNotificationUseCase: SendJobCompletedSuccessNotificationUseCase,
    sendJobCompletedFailureNotificationUseCase: SendJobCompletedFailureNotificationUseCase,
    sendJobQueuedNotificationUseCase: SendJobQueuedNotificationUseCase,
    sendJobCompletedPartiallyFailedNotificationUseCase: SendJobCompletedPartiallyFailedNotificationUseCase,
    sendJobFinalizedNotificationUseCase: SendJobCompletedFinalizedNotificationUseCase,
    sendJobStartedNotificationUseCase: SendJobStartedNotificationUseCase
  ) {
    this.sendJobCompletedSuccessNotificationUseCase =
      sendJobCompletedNotificationUseCase;

    this.sendJobCompletedFailureNotificationUseCase =
      sendJobCompletedFailureNotificationUseCase;

    this.sendJobQueuedNotificationUseCase = sendJobQueuedNotificationUseCase;

    this.sendJobCompletedPartiallyFailedNotificationUseCase =
      sendJobCompletedPartiallyFailedNotificationUseCase;

    this.sendJobFinalizedNotificationUseCase =
      sendJobFinalizedNotificationUseCase;
    this.sendJobStartedNotificationUseCase = sendJobStartedNotificationUseCase;
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
        let jenkinsAPI: JenkinsRestAPIService;
        if (req.params.settingsEnvelopeID) {
          jenkinsAPI = new JenkinsRestAPIService(
            req.params.settingsEnvelopeID,
            botApplication.getWebexSDK()
          );
        }

        switch (build.phase) {
          case JenkinsJobPhase.QUEUED:
            await this.sendJobQueuedNotificationUseCase.execute(
              {
                buildNumber: build.number,
                jobName: name,
                buildPhase: build.phase,
                buildURL: build.full_url
              },
              bot
            );
            break;
          case JenkinsJobPhase.STARTED:
            await this.sendJobStartedNotificationUseCase.execute(
              {
                buildNumber: build.number,
                jobName: name,
                buildPhase: build.phase,
                buildURL: build.full_url
              },
              bot
            );
            break;
          case JenkinsJobPhase.COMPLETED:
            let commits: Commit[];
            let repoName;
            let repoURL;
            let hasFailedStage;
            if (build.scm?.url) {
              const url = new URL(build.scm.url);
              repoName = /(?<=\/)(.*?)(?=\.)/.exec(url.pathname)[0];
              repoURL = build.scm.url?.replace('.git', '');
            }
            if (jenkinsAPI) {
              [{ commits }, { hasFailedStage }] = await Promise.all([
                jenkinsAPI.getBuildData(build.url),
                jenkinsAPI.getPipelineBuildData(build.url)
              ]);
            }
            switch (build.status) {
              case JenkinsJobStatus.FAILURE:
                await this.sendJobCompletedFailureNotificationUseCase.execute(
                  {
                    jobName: name,
                    buildNumber: build.number,
                    buildPhase: build.phase,
                    buildStatus: build.status,
                    buildURL: build.full_url,
                    repoName,
                    repoURL,
                    numberOfGitChanges: build.scm?.changes?.length,
                    commits
                  },
                  bot
                );
                break;
              case JenkinsJobStatus.SUCCESS:
                if (hasFailedStage) {
                  await this.sendJobCompletedPartiallyFailedNotificationUseCase.execute(
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
                  await this.sendJobCompletedSuccessNotificationUseCase.execute(
                    {
                      jobName: name,
                      buildNumber: build.number,
                      buildPhase: build.phase,
                      buildStatus: build.status,
                      buildURL: build.full_url,
                      repoName,
                      repoURL,
                      numberOfGitChanges: build.scm?.changes?.length,
                      commits
                    },
                    bot
                  );
                }

                break;
              default:
                break;
            }
            break;
          case JenkinsJobPhase.FINALIZED:
            await this.sendJobFinalizedNotificationUseCase.execute(
              {
                jobName: name,
                buildNumber: build.number,
                buildPhase: build.phase,
                buildURL: build.full_url,
                buildStatus: build.status
              },
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
