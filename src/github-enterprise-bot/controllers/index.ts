import {
  sendIssueAssignedNotificationUseCase,
  sendPullRequestOpenedUseCase
} from '../useCases';
import GithubEnterpriseWebhookController from './GithubEnterpriseWebhookController';
import IssueAssignedEventController from './IssueAssignedEventController';
import PullRequestEventController from './PullRequestEventController';

const issueAssignedEventController = new IssueAssignedEventController(
  sendIssueAssignedNotificationUseCase
);

const pullRequestEventController = new PullRequestEventController(
  sendPullRequestOpenedUseCase
);

const githubEnterpriseWebhookController = new GithubEnterpriseWebhookController(
  issueAssignedEventController,
  pullRequestEventController
);

export { githubEnterpriseWebhookController };
