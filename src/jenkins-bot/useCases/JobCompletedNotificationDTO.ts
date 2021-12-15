import { Commit } from '../templates/JobCompletedTemplate';
import { JenkinsJobPhase } from './JenkinsJobPhase';
import { JenkinsJobStatus } from './JenkinsJobStatus';

export interface JobCompletedNotificationDTO {
  jobName: string;
  buildPhase: JenkinsJobPhase;
  buildStatus: JenkinsJobStatus;
  buildURL: string;
  buildNumber: number;
  numberOfGitChanges?: number;
  commits?: Commit[];
  repoURL?: string;
  repoName?: string;
}
