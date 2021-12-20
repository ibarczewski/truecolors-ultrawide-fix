import { Bot } from '../../common/Bot';
import JobCompletedTemplate, {
  JobCompletedTemplateData
} from '../templates/JobCompletedTemplate';
import { JenkinsJobStatus } from '../common/JenkinsJobStatus';
import { JobCompletedNotificationDTO } from './common/JobCompletedNotificationDTO';

interface JobCompletedFailureNotificationDTO
  extends Omit<JobCompletedNotificationDTO, 'buildStatus'> {}

export default class SendJobCompletedFailureNotificationUseCase {
  private template: JobCompletedTemplate;
  constructor(template: JobCompletedTemplate) {
    this.template = template;
  }
  async execute(request: JobCompletedFailureNotificationDTO, bot: Bot) {
    try {
      const data: JobCompletedTemplateData = {
        jobStatus: JenkinsJobStatus.FAILURE,
        buildNumber: request.buildNumber,
        buildURL: request.buildURL,
        commits: request.commits,
        jobName: request.jobName,
        numberOfChanges: request.numberOfGitChanges,
        scm: request.repoName,
        scmURL: request.repoURL
      };

      const jobCompletedCard = this.template.buildCard(data);
      bot.sendCard(jobCompletedCard);
    } catch (error) {
      console.log(error);
    }
  }
}
