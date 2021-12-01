import { Bot } from '../../common/Bot';
import {
  TaskCreatedTemplate,
  TaskCreatedTemplateData
} from '../../common/templates/TaskCreated';

export interface SendPullRequestCreatedNotificationDTO {
  repositoryName: string;
  repositoryURL: string;
  creatorName: string;
  creatorURL: string;
  pullRequestTitle: string;
  pullRequestURL: string;
  pullRequestNumber: number;
}

export default class SendPullRequestOpenedNotificationUseCase {
  private template: TaskCreatedTemplate;
  constructor(template: TaskCreatedTemplate) {
    this.template = template;
  }
  execute(request: SendPullRequestCreatedNotificationDTO, bot: Bot) {
    const data: TaskCreatedTemplateData = {
      projectName: `[${request.repositoryName}](${request.repositoryURL})`,
      title: `Pull Request opened: [${request.pullRequestTitle}](${request.pullRequestURL})`,
      metadata: [
        {
          key: 'Opened by:',
          value: `[${request.creatorName}](${request.creatorURL})`
        },
        {
          key: 'PR#:',
          value: `${request.pullRequestNumber}`
        }
      ],
      actions: [
        {
          type: 'Action.OpenUrl',
          title: 'Open in Github Enterprise',
          url: request.pullRequestURL
        }
      ]
    };

    const pullRequestOpenedCard = this.template.buildCard(data);
    bot.sendCard(pullRequestOpenedCard);
  }
}
