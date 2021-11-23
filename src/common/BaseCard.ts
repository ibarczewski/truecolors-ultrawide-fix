import parse from 'json-templates';
import { Bot } from './Bot';
export class BaseCard<DataType> {
  private buildCard;
  protected static template;
  constructor() {
    this.buildCard = parse((this.constructor as typeof BaseCard).template);
  }

  send(bot: Bot, data: DataType) {
    const card = this.buildCard(data);
    bot.sendCard(card);
  }
}
