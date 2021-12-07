import { Request, Response } from 'express';
import { Bot } from '../../common/Bot';
import { BotFramework } from '../../common/BotFramework';
import { taskCreatedTemplate } from '../../common/templates';
import { TaskCreatedTemplateData } from '../../common/templates/TaskCreated';

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

export class JenkinsNotificationController {
  execute(
    req: Request<{ roomId: string }, {}, JenkinsNotificationPayload>,
    res: Response,
    framework: BotFramework
  ) {
    const bot: Bot = framework.getBotByRoomId(req.params.roomId);
    if (bot) {
      try {
        const { name, build } = req.body;
        const data: TaskCreatedTemplateData = {
          projectName: name,
          title: `Job ${build.phase}`,
          metadata: [
            {
              key: 'Build number:',
              value: !!build.full_url
                ? `[${build.number}](${build.full_url})`
                : `${build.number}`
            },
            { key: 'Status:', value: build.status }
          ],
          ...(build.full_url && {
            actions: [
              {
                type: 'Action.OpenUrl',
                title: 'Open in Jenkins',
                url: build.full_url
              }
            ]
          })
        };

        const jobCompletedCard = taskCreatedTemplate.buildCard(data);
        bot.sendCard(jobCompletedCard);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('could not find bot');
    }

    res.end();
  }
}
