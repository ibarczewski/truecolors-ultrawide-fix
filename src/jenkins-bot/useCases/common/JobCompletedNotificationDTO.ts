import { Commit } from '../../templates/JobCompletedTemplate';
import { JenkinsJobStatus } from '../../common/JenkinsJobStatus';
import { DefaultJobNotificationDTO } from './DefaultJobNotificationDTO';

export interface JobCompletedNotificationDTO extends DefaultJobNotificationDTO {
  buildStatus: JenkinsJobStatus;
  numberOfGitChanges?: number;
  commits?: Commit[];
  repoURL?: string;
  repoName?: string;
}
