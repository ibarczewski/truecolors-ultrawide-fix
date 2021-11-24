import { Bot } from './Bot';
import { Template } from './templates/Template';
export class WebexCard<TemplateDataType> {
  private template: Template<TemplateDataType>;
  private bot: Bot;
  private data: TemplateDataType;
  public card: string;

  constructor(
    template: Template<TemplateDataType>,
    data: TemplateDataType,
    bot: Bot
  ) {
    this.template = template;
    this.data = data;
    this.bot = bot;
  }

  public send() {
    const card = this.template(this.data);
    this.bot.sendCard(card);
  }
}
