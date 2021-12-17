import { Bot } from '../../common/Bot';
import {
  TaskCreatedTemplate,
  TaskCreatedTemplateData
} from '../../common/templates/TaskCreated';
import { JobCompletedNotificationDTO } from './JobCompletedNotificationDTO';

interface JobStartedNotificationDTO
  extends Omit<JobCompletedNotificationDTO, 'buildStatus'> {}

export default class SendJobStartedNotificationUseCase {
  private template: TaskCreatedTemplate;
  constructor(template: TaskCreatedTemplate) {
    this.template = template;
  }
  async execute(request: JobStartedNotificationDTO, bot: Bot) {
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

      const jobStartedCard = this.template.buildCard(data);
      bot.sendCard(jobStartedCard);
    } catch (error) {
      console.log(error);
    }
  }
}
