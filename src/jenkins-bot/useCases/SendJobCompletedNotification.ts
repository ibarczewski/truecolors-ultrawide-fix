import { Bot } from '../../common/Bot';
import {
  TaskCreatedTemplate,
  TaskCreatedTemplateData
} from '../../common/templates/TaskCreated';

export interface SendJobCompletedNotificationDTO {
  jobName: string;
  buildPhase: 'COMPLETED' | 'FINALIZED' | 'STARTED' | 'QUEUED';
  buildStatus: 'SUCCESS' | 'FAILED';
  buildURL: string;
  buildNumber: number;
  numberOfGitChanges?: number;
}

export default class SendJobCompletedNotificationUseCase {
  private template: TaskCreatedTemplate;
  constructor(template: TaskCreatedTemplate) {
    this.template = template;
  }
  async execute(request: SendJobCompletedNotificationDTO, bot: Bot) {
    try {
      const data: TaskCreatedTemplateData = {
        projectName: request.jobName,
        title: `Job ${request.buildPhase}`,
        metadata: [
          {
            key: 'Build number:',
            value: !!request.buildURL
              ? `[${request.buildNumber}](${request.buildURL})`
              : `${request.buildNumber}`
          },
          { key: 'Status:', value: request.buildStatus },
          ...(request.numberOfGitChanges
            ? [
                {
                  key: 'Number of changes:',
                  value: `${request.numberOfGitChanges}`
                }
              ]
            : [])
        ],
        ...(request.buildURL && {
          actions: [
            {
              type: 'Action.OpenUrl',
              title: 'Open in Jenkins',
              url: request.buildURL
            }
          ]
        })
      };

      const jobCompletedCard = this.template.buildCard(data);
      bot.sendCard(jobCompletedCard);
    } catch (error) {
      console.log(error);
    }
  }
}
