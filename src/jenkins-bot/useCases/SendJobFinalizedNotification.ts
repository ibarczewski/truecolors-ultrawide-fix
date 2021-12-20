import { JenkinsJobStatus } from '../common/JenkinsJobStatus';
import { DefaultJobNotificationDTO } from './common/DefaultJobNotificationDTO';
import SendDefaultJobNotification from './common/SendDefaultJobNotification';

interface JobFinalizedNotificationDTO extends DefaultJobNotificationDTO {
  buildStatus: JenkinsJobStatus;
}

export default class SendJobFinalizedNotificationUseCase extends SendDefaultJobNotification<JobFinalizedNotificationDTO> {}
