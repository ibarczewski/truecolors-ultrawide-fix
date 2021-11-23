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

test('when task is completed, posts a card', async () => {
  await request(app)
    .post('/jenkins/foo')
    .send({
      name: 'asgard',
      url: 'job/asgard/',
      build: {
        full_url: 'http://localhost:8080/job/asgard/18/',
        number: 18,
        phase: 'COMPLETED',
        status: 'SUCCESS',
        url: 'job/asgard/18/',
        scm: {
          url: 'https://github.com/evgeny-goldin/asgard.git',
          branch: 'origin/master',
          commit: 'c6d86dc654b12425e706bcf951adfe5a8627a517'
        },
        artifacts: {
          'asgard.war': {
            archive: 'http://localhost:8080/job/asgard/18/artifact/asgard.war'
          },
          'asgard-standalone.jar': {
            archive:
              'http://localhost:8080/job/asgard/18/artifact/asgard-standalone.jar',
            s3: 'https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar'
          }
        }
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
                      "text": "asgard",
                      "type": "TextBlock",
                      "weight": "Lighter",
                    },
                    Object {
                      "color": "Light",
                      "size": "Large",
                      "spacing": "Small",
                      "text": "Job COMPLETED",
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
                      "text": "Build number:",
                      "type": "TextBlock",
                    },
                    Object {
                      "color": "Light",
                      "spacing": "Small",
                      "text": "Status:",
                      "type": "TextBlock",
                    },
                  ],
                  "type": "Column",
                  "width": 35,
                },
                Object {
                  "items": Array [
                    Object {
                      "color": "Light",
                      "text": "[18](http://localhost:8080/job/asgard/18/)",
                      "type": "TextBlock",
                    },
                    Object {
                      "color": "Light",
                      "spacing": "Small",
                      "text": "SUCCESS",
                      "type": "TextBlock",
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
            Object {
              "actions": Array [
                Object {
                  "title": "Open in Jenkins",
                  "type": "Action.OpenUrl",
                  "url": "http://localhost:8080/job/asgard/18/",
                },
              ],
              "type": "ActionSet",
            },
          ],
          "type": "AdaptiveCard",
          "version": "1.2",
        },
      ],
    ]
  `);
});
