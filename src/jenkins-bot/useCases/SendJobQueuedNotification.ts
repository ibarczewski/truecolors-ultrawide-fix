import { DefaultJobNotificationDTO } from './common/DefaultJobNotificationDTO';
import SendDefaultJobNotification from './common/SendDefaultJobNotification';

interface JobQueuedNotificationDTO
  extends Omit<DefaultJobNotificationDTO, 'buildStatus'> {}

export default class SendJobQueuedNotificationUseCase extends SendDefaultJobNotification<JobQueuedNotificationDTO> {}
