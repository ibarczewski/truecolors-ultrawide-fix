import { Bot } from '../../common/Bot';
import {
  TaskCreatedTemplate,
  TaskCreatedTemplateData
} from '../../common/templates/TaskCreated';
import { JobCompletedNotificationDTO } from './JobCompletedNotificationDTO.';

interface JobCompletedSuccessNotificationDTO
  extends JobCompletedNotificationDTO {
  numberOfGitChanges?: number;
}

export default class SendJobCompletedSuccessNotificationUseCase {
  private template: TaskCreatedTemplate;
  constructor(template: TaskCreatedTemplate) {
    this.template = template;
  }
  async execute(request: JobCompletedSuccessNotificationDTO, bot: Bot) {
    try {
      const data: TaskCreatedTemplateData = {
        projectName: request.jobName,
        title: `Job ${request.buildPhase} ☀️`,
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
