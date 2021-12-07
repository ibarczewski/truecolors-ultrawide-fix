import request from 'supertest';
import { handlers } from './handlers';
import { routes } from './routes';
import { mockBot } from 'webex-node-bot-framework';
import BotApplication from '../common/BotApplication';
import BotsApplication from '../common/BotsApplication';

jest.mock('webex-node-bot-framework');

function createMockGithubBotApp() {
  const githubEnterpriseBot = new BotApplication(
    'github',
    'foo',
    null,
    routes,
    handlers
  );
  return new BotsApplication([githubEnterpriseBot]).expressApp;
}

describe('issue assigned notification', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('when issue is assigned, posts an issue assigned notification card', async () => {
    const app = createMockGithubBotApp();
    await request(app)
      .post('/github/foo')
      .send({
        action: 'assigned',
        issue: {
          title: 'fooTitle',
          html_url: 'fooHtml',
          number: 5
        },
        repository: {
          name: 'fooRepoName',
          html_url: 'fooURL'
        },
        assignee: {
          login: 'fooUser',
          html_url: 'fooUserUrl'
        },
        sender: {
          login: 'barUser',
          html_url: 'barUserUrl'
        }
      });

    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });

  test('to be deprecated: when issue is unassigned, does not post issue assigned', async () => {
    const app = createMockGithubBotApp();

    await request(app)
      .post('/github/foo')
      .send({
        action: 'unassigned',
        issue: {
          title: 'fooTitle',
          html_url: 'fooHtml',
          number: 5
        },
        repository: {
          name: 'fooRepoName',
          html_url: 'fooURL'
        },
        assignee: {
          login: 'fooUser',
          html_url: 'fooUserUrl'
        },
        sender: {
          login: 'barUser',
          html_url: 'barUserUrl'
        }
      });

    expect(mockBot.sendCard).not.toHaveBeenCalled();
  });

  test('when pull request opened, posts a pull request notification card', async () => {
    const app = createMockGithubBotApp();
    await request(app)
      .post('/github/foo')
      .send({
        action: 'opened',
        pull_request: {
          title: 'fooTitle',
          html_url: 'fooHtml',
          number: 5
        },
        repository: {
          name: 'fooRepoName',
          html_url: 'fooURL'
        },
        sender: {
          login: 'barUser',
          html_url: 'barUserUrl'
        }
      });

    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });
});
