import { BaseCard } from '../../common/BaseCard';
import JobCompletedNotificationTemplate from './JobCompletedNotificationTemplate.json';

export type JobCompletedNotificationData = {
  jobName: string;
  buildUrl: string;
  number: number;
  phase: 'COMPLETED' | string;
  status: 'SUCCESS' | string;
};

export class JobCompletedNotification extends BaseCard<JobCompletedNotificationData> {
  protected static template = JobCompletedNotificationTemplate;
}
