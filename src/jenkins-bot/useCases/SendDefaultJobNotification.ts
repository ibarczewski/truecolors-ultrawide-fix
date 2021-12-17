import { Bot } from '../../common/Bot';
import {
  TaskCreatedTemplate,
  TaskCreatedTemplateData
} from '../../common/templates/TaskCreated';
import { JobCompletedNotificationDTO } from './JobCompletedNotificationDTO';

export interface DefaultJobNotificationDTO
  extends Omit<JobCompletedNotificationDTO, 'buildStatus'> {}

export default class SendDefaultJobNotification {
  protected template: TaskCreatedTemplate;
  constructor(template: TaskCreatedTemplate) {
    this.template = template;
  }
  async execute(request: DefaultJobNotificationDTO, bot: Bot) {
    try {
      this.sendCard(request, bot);
    } catch (error) {
      console.log(error);
    }
  }

  protected sendCard(request, bot, additionalMetadata = []) {
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
        ...additionalMetadata
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

    const jobCard = this.template.buildCard(data);
    bot.sendCard(jobCard);
  }
}
