import { Bot } from '../../common/Bot';
import {
  TaskCreatedTemplate,
  TaskCreatedTemplateData
} from '../../common/templates/TaskCreated';
import { JenkinsJobStatus } from '../common/JenkinsJobStatus';
import { DefaultJobNotificationDTO } from './common/DefaultJobNotificationDTO';

interface JobCompletedPartiallyFailedNotificationDTO
  extends DefaultJobNotificationDTO {
  buildStatus: JenkinsJobStatus;
}

export default class SendJobCompletedPartiallyFailedNotificationUseCase {
  private template: TaskCreatedTemplate;
  constructor(template: TaskCreatedTemplate) {
    this.template = template;
  }
  async execute(request: JobCompletedPartiallyFailedNotificationDTO, bot: Bot) {
    try {
      const data: TaskCreatedTemplateData = {
        projectName: request.jobName,
        title: `Job ${request.buildPhase} ⛅`,
        metadata: [
          {
            key: 'Build number:',
            value: !!request.buildURL
              ? `[${request.buildNumber}](${request.buildURL})`
              : `${request.buildNumber}`
          },
          { key: 'Status:', value: request.buildStatus }
        ],
        ...(request.buildURL && {
          actions: [
            {
              type: 'Action.OpenUrl',
              title: 'See the Console Output',
              url: `${request.buildURL}console`
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
