import { Bot } from '../../common/Bot';
import JenkinsConfigurationTemplate from '../templates/Configuration';

export default class SendJenkinsConfigurationFormUseCase {
  private template: JenkinsConfigurationTemplate;
  constructor(template: JenkinsConfigurationTemplate) {
    this.template = template;
  }

  execute(toUserId: string, bot: Bot) {
    const jenkinsConfigCard = this.template.buildCard({ roomId: bot.room.id });
    bot.say("I have DM'd you the config form");
    bot.dmCard(toUserId, jenkinsConfigCard);
  }
}
