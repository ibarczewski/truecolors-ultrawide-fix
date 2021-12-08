import {
  JenkinsJobPhase,
  JenkinsJobStatus
} from '../controllers/JenkinsNotificationController';

export interface JobCompletedNotificationDTO {
  jobName: string;
  buildPhase: JenkinsJobPhase;
  buildStatus: JenkinsJobStatus;
  buildURL: string;
  buildNumber: number;
}
