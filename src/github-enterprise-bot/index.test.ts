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

test('when issue is assigned, posts a card', async () => {
  await request(app)
    .post('/github/foo')
    .send({
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
