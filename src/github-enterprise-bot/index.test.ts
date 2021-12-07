import request from 'supertest';

import app from '../app';

const mockBot = {
  sendCard: jest.fn()
};
jest.mock('webex-node-bot-framework', () =>
  jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    getBotByRoomId: jest.fn().mockImplementation(() => mockBot),
    on: jest.fn(),
    hears: jest.fn(),
    debug: jest.fn()
  }))
);

describe('issue assigned notification', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('when issue is assigned, posts an issue assigned notification card', async () => {
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
