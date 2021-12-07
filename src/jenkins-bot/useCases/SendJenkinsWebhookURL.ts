import { Bot } from '../../common/Bot';

export default class SendJenkinsWebhookURLUseCase {
  execute(request: { roomId: string; settingsEnvelopeId: string }, bot: Bot) {
    bot.say(
      `${process.env.FRAMEWORK_WEBHOOK_URL}/jenkins/${request.roomId}/${request.settingsEnvelopeId}`
    );
  }
}
