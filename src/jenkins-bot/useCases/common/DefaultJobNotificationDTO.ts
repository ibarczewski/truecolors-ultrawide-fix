import { JenkinsJobPhase } from '../../common/JenkinsJobPhase';
import { JenkinsJobStatus } from '../../common/JenkinsJobStatus';

export interface DefaultJobNotificationDTO {
  jobName: string;
  buildPhase: JenkinsJobPhase;
  buildURL: string;
  buildNumber: number;
  buildStatus?: JenkinsJobStatus;
}
