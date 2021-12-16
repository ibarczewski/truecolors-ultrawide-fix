import { Bot } from '../../common/Bot';
import {
  TaskCreatedTemplate,
  TaskCreatedTemplateData
} from '../../common/templates/TaskCreated';
import { JobCompletedNotificationDTO } from './JobCompletedNotificationDTO';
interface JobCompletedFinalizedNotificationDTO
  extends Omit<JobCompletedNotificationDTO, 'buildStatus'> {}
export default class SendJobCompletedFinalizedNotificationUseCase {
  private template: TaskCreatedTemplate;
  constructor(template: TaskCreatedTemplate) {
    this.template = template;
  }
  async execute(request: JobCompletedFinalizedNotificationDTO, bot: Bot) {
    try {
      const data: TaskCreatedTemplateData = {
        projectName: request.jobName,
        title: `Job FINALIZED`,
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

      const jobCompletedCard = this.template.buildCard(data);
      bot.sendCard(jobCompletedCard);
    } catch (error) {
      console.log(error);
    }
  }
}
