import { Bot } from '../../common/Bot';
import {
  TaskCreatedTemplate,
  TaskCreatedTemplateData
} from '../../common/templates/TaskCreated';
import { JobCompletedNotificationDTO } from './JobCompletedNotificationDTO';

interface JobQueuedNotificationDTO
  extends Omit<JobCompletedNotificationDTO, 'buildStatus'> {}

export default class SendJobQueuedNotificationUseCase {
  private template: TaskCreatedTemplate;
  constructor(template: TaskCreatedTemplate) {
    this.template = template;
  }
  async execute(request: JobQueuedNotificationDTO, bot: Bot) {
    try {
      const data: TaskCreatedTemplateData = {
        projectName: request.jobName,
        title: `Job ${request.buildPhase}`,
        metadata: [
          {
            key: 'Build number:',
            value: !!request.buildURL
              ? `[${request.buildNumber}](${request.buildURL})`
              : `${request}`
          }
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

      const jobQueuedCard = this.template.buildCard(data);
      bot.sendCard(jobQueuedCard);
    } catch (error) {
      console.log(error);
    }
  }
}
