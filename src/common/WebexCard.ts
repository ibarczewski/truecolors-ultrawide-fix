import { Bot } from './Bot';
import { Template } from './templates/Template';
export class WebexCard<TemplateDataType> {
  private card: any;

  constructor(template: Template<TemplateDataType>, data: TemplateDataType) {
    this.card = template(data);
  }

  public send(bot: Bot) {
    bot.sendCard(this.card);
  }
}
