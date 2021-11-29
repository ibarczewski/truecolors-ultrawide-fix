import { sendIssueAssignedNotificationUseCase } from '../useCases';
import GithubEnterpriseWebhookController from './GithubEnterpriseWebhookController';
import IssueAssignedEventController from './IssueAssignedEventController';

const issueAssignedEventController = new IssueAssignedEventController(
  sendIssueAssignedNotificationUseCase
);

const githubEnterpriseWebhookController = new GithubEnterpriseWebhookController(
  issueAssignedEventController
);

export { githubEnterpriseWebhookController };
