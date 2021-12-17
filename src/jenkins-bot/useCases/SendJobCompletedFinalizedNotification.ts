import { Bot } from '../../common/Bot';
import { JobCompletedNotificationDTO } from './JobCompletedNotificationDTO';
import SendDefaultJobNotification from './SendDefaultJobNotification';
export default class SendJobCompletedFinalizedNotificationUseCase extends SendDefaultJobNotification {
  override async execute(
    request: JobCompletedNotificationDTO,
    bot: Bot
  ): Promise<void> {
    try {
      const additionalMetadata = [
        {
          key: 'Status:',
          value: request.buildStatus
        }
      ];
      this.sendCard(request, bot, additionalMetadata);
    } catch (error) {
      console.log(error);
    }
  }
}
