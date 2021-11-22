import request from 'supertest';
import botApp from './bot';

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
  await request(botApp)
    .post('/foo')
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

  expect(mockBot.sendCard.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
          "body": Array [
            Object {
              "columns": Array [
                Object {
                  "items": Array [
                    Object {
                      "color": "Accent",
                      "text": "[fooRepoName](fooURL)",
                      "type": "TextBlock",
                      "weight": "Lighter",
                    },
                    Object {
                      "color": "Light",
                      "size": "Large",
                      "spacing": "Small",
                      "text": "Issue assigned to [fooUser](fooUserUrl)",
                      "type": "TextBlock",
                      "weight": "Bolder",
                      "wrap": true,
                    },
                  ],
                  "type": "Column",
                  "width": "stretch",
                },
              ],
              "type": "ColumnSet",
            },
            Object {
              "columns": Array [
                Object {
                  "items": Array [
                    Object {
                      "color": "Light",
                      "text": "Assigned by:",
                      "type": "TextBlock",
                    },
                    Object {
                      "color": "Light",
                      "spacing": "Small",
                      "text": "Issue:",
                      "type": "TextBlock",
                      "weight": "Lighter",
                    },
                  ],
                  "type": "Column",
                  "width": 35,
                },
                Object {
                  "items": Array [
                    Object {
                      "color": "Light",
                      "text": "[barUser](barUserUrl)",
                      "type": "TextBlock",
                    },
                    Object {
                      "color": "Light",
                      "spacing": "Small",
                      "text": "[#5 - fooTitle](fooHtml)",
                      "type": "TextBlock",
                      "weight": "Lighter",
                    },
                  ],
                  "type": "Column",
                  "width": 65,
                },
              ],
              "horizontalAlignment": "Center",
              "spacing": "Padding",
              "type": "ColumnSet",
            },
          ],
          "type": "AdaptiveCard",
          "version": "1.2",
        },
      ],
    ]
  `);
});
