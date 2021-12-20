import { DefaultJobNotificationDTO } from './common/DefaultJobNotificationDTO';
import SendDefaultJobNotification from './common/SendDefaultJobNotification';

interface JobStartedNotificationDTD
  extends Omit<DefaultJobNotificationDTO, 'buildStatus'> {}

export default class SendJobStartedNotificationUseCase extends SendDefaultJobNotification<JobStartedNotificationDTD> {}
