import BotApplication from './BotApplication';

export default interface BotCardFormController {
  execute(body: any, botApplication: BotApplication): void;
}
