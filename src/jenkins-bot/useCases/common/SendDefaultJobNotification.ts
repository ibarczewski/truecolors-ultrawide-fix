import { Bot } from '../../../common/Bot';
import {
  TaskCreatedTemplate,
  TaskCreatedTemplateData
} from '../../../common/templates/TaskCreated';
import { DefaultJobNotificationDTO } from './DefaultJobNotificationDTO';

export default class SendDefaultJobNotification<
  DTO extends DefaultJobNotificationDTO
> {
  protected template: TaskCreatedTemplate;
  constructor(template: TaskCreatedTemplate) {
    this.template = template;
  }
  async execute(request: DTO, bot: Bot) {
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
          ...(request.buildStatus
            ? [
                {
                  key: 'Status:',
                  value: request.buildStatus
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

      const jobCard = this.template.buildCard(data);
      bot.sendCard(jobCard);
    } catch (error) {
      console.log(error);
    }
  }
}
