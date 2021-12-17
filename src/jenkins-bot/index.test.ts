import request from 'supertest';
import { mockBot, mockWebex } from 'webex-node-bot-framework';

import BotApplication from '../common/BotApplication';
import BotsApplication from '../common/BotsApplication';
import { routes } from './routes';
import { handlers } from './handlers';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { JenkinsNotificationPayload } from './controllers/JenkinsNotificationController';
import { JenkinsJobPhase } from './useCases/JenkinsJobPhase';
import { JenkinsJobStatus } from './useCases/JenkinsJobStatus';
import faker from 'faker';
import { JenkinsPipelineStageStatus } from './useCases/JenkinsPipelineStageStatus';

enum MockBuildNumber {
  DEFAULT = 1,
  PARTIALLY_FAILED = 2,
  MANY_GIT_CHANGES = 3,
  WFAPI_ERROR = 4
}

const apiJsonEndpointHandler = rest.get(
  'http://localhost:8080/job/asgard/:buildNumber/api/json',
  (req, res, ctx) => {
    const body = {};
    if (req.params.buildNumber === `${MockBuildNumber.MANY_GIT_CHANGES}`) {
      faker.seed(22);

      const items = [];

      Array.from(Array(55)).forEach(() => {
        items.push({
          id: faker.git.commitSha(),
          author: {
            fullName: faker.internet.userName()
          },
          authorEmail: faker.internet.email(),
          msg: faker.git.commitMessage()
        });
      });
      body['changeSet'] = { items };
    }

    return res(ctx.status(200), ctx.json(body));
  }
);

const wfApiEndpointHandler = rest.get(
  'http://localhost:8080/job/asgard/:buildNumber/wfapi',
  (req, res, ctx) => {
    const body = {};
    if (req.params.buildNumber === `${MockBuildNumber.PARTIALLY_FAILED}`) {
      body['stages'] = [
        { status: JenkinsPipelineStageStatus.SUCCESS },
        { status: JenkinsPipelineStageStatus.FAILED },
        { status: JenkinsPipelineStageStatus.SUCCESS }
      ];
    }

    if (req.params.buildNumber === `${MockBuildNumber.WFAPI_ERROR}`) {
      return res(ctx.status(500));
    }

    return res(ctx.status(200), ctx.json(body));
  }
);
const mockHandlers = [apiJsonEndpointHandler, wfApiEndpointHandler];

const server = setupServer(...mockHandlers);

jest.mock('webex-node-bot-framework');

function createMockJenkinsBotApp() {
  const jenkinsBot = new BotApplication(
    'jenkins',
    'foo',
    null,
    routes,
    handlers
  );
  return new BotsApplication([jenkinsBot]).expressApp;
}

describe('jenkins bot', () => {
  beforeAll(() =>
    server.listen({
      onUnhandledRequest: ({ headers, method, url }) => {
        if (headers.get('User-Agent') !== 'supertest') {
          throw new Error(`Unhandled ${method} request to ${url}`);
        }
      }
    })
  );

  afterAll(() => server.close());

  afterEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
  });

  test('when task is completed, posts a card', async () => {
    const app = createMockJenkinsBotApp();

    const expectedJobNumber = MockBuildNumber.DEFAULT;

    await request(app)
      .post('/jenkins/fooRoomId')
      .set('User-Agent', 'supertest')
      .send({
        name: 'asgard',
        url: 'job/asgard/',
        build: {
          full_url: `http://localhost:8080/job/asgard/${expectedJobNumber}/`,
          number: expectedJobNumber,
          phase: 'COMPLETED',
          status: 'SUCCESS',
          url: `job/asgard/${expectedJobNumber}/`,
          scm: {},
          artifacts: {
            'asgard.war': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard.war`
            },
            'asgard-standalone.jar': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard-standalone.jar`,
              s3: 'https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar'
            }
          }
        }
      });

    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });

  test('if job has scm data, include number of changes and repo name on the card', async () => {
    const app = createMockJenkinsBotApp();

    const expectedJobNumber = MockBuildNumber.DEFAULT;

    const jobCompletedNotification: JenkinsNotificationPayload = {
      name: 'asgard',
      url: 'job/asgard/',
      build: {
        full_url: `http://localhost:8080/job/asgard/${expectedJobNumber}/`,
        number: expectedJobNumber,
        phase: JenkinsJobPhase.COMPLETED,
        status: JenkinsJobStatus.SUCCESS,
        url: `job/asgard/${expectedJobNumber}/`,
        scm: {
          url: 'https://github.com/evgeny-goldin/asgard.git',
          branch: 'origin/master',
          commit: 'c6d86dc654b12425e706bcf951adfe5a8627a517',
          changes: ['1', '2', '3.txt']
        },
        artifacts: {
          'asgard.war': {
            archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard.war`
          },
          'asgard-standalone.jar': {
            archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard-standalone.jar`,
            s3: 'https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar'
          }
        }
      }
    };

    await request(app)
      .post('/jenkins/fooRoomId')
      .set('User-Agent', 'supertest')
      .send(jobCompletedNotification);

    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });

  test('when the job completes and there is commit data, shows the commit message author and sha', async () => {
    jest.spyOn(mockWebex.attachmentActions, 'get').mockResolvedValue({
      inputs: {
        username: 'tester',
        apiKey: 'fooKey',
        jenkinsUrl: 'http://localhost:8080/'
      }
    });

    const app = createMockJenkinsBotApp();

    const expectedJobNumber = MockBuildNumber.MANY_GIT_CHANGES;

    const jobCompletedNotification: JenkinsNotificationPayload = {
      name: 'asgard',
      url: 'job/asgard/',
      build: {
        full_url: `http://localhost:8080/job/asgard/${expectedJobNumber}/`,
        number: expectedJobNumber,
        phase: JenkinsJobPhase.COMPLETED,
        status: JenkinsJobStatus.SUCCESS,
        url: `job/asgard/${expectedJobNumber}/`,
        scm: {
          url: 'https://github.com/evgeny-goldin/asgard.git',
          branch: 'origin/master',
          commit: 'c6d86dc654b12425e706bcf951adfe5a8627a517',
          changes: Array.from(Array(55).keys())
        },
        artifacts: {
          'asgard.war': {
            archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard.war`
          },
          'asgard-standalone.jar': {
            archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard-standalone.jar`,
            s3: 'https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar'
          }
        }
      }
    };

    await request(app)
      .post('/jenkins/fooRoomId/fooEnvelopeId')
      .set('User-Agent', 'supertest')
      .send(jobCompletedNotification);

    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });

  test('when the job fails, posts a card', async () => {
    const app = createMockJenkinsBotApp();

    const expectedJobNumber = MockBuildNumber.DEFAULT;

    await request(app)
      .post('/jenkins/fooRoomId')
      .set('User-Agent', 'supertest')
      .send({
        name: 'asgard',
        url: 'job/asgard/',
        build: {
          full_url: `http://localhost:8080/job/asgard/${expectedJobNumber}/`,
          number: expectedJobNumber,
          phase: 'COMPLETED',
          status: 'FAILURE',
          url: `job/asgard/${expectedJobNumber}/`,
          scm: {
            url: 'https://github.com/evgeny-goldin/asgard.git',
            branch: 'origin/master',
            commit: 'c6d86dc654b12425e706bcf951adfe5a8627a517'
          },
          artifacts: {
            'asgard.war': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard.war`
            },
            'asgard-standalone.jar': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard-standalone.jar`,
              s3: 'https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar'
            }
          }
        }
      });

    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });

  test('when the job is queued, posts a card', async () => {
    const app = createMockJenkinsBotApp();
    const expectedJobNumber = 16;

    await request(app)
      .post('/jenkins/fooRoomId')
      .set('User-Agent', 'supertest')
      .send({
        name: 'asgard',
        url: 'job/asgard/',
        build: {
          full_url: `http://localhost:8080/job/asgard/${expectedJobNumber}/`,
          number: expectedJobNumber,
          phase: 'QUEUED',
          status: '',
          url: `job/asgard/${expectedJobNumber}/`,
          scm: {
            url: 'https://github.com/evgeny-goldin/asgard.git',
            branch: 'origin/master',
            commit: 'c6d86dc654b12425e706bcf951adfe5a8627a517'
          },
          artifacts: {
            'asgard.war': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard.war`
            },
            'asgard-standalone.jar': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard-standalone.jar`,
              s3: 'https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar'
            }
          }
        }
      });

    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });

  test('when the job partially fails, posts a card', async () => {
    jest.spyOn(mockWebex.attachmentActions, 'get').mockResolvedValue({
      inputs: {
        username: 'tester',
        apiKey: 'fooKey',
        jenkinsUrl: 'http://localhost:8080/'
      }
    });
    const app = createMockJenkinsBotApp();
    const expectedJobNumber = MockBuildNumber.PARTIALLY_FAILED;

    await request(app)
      .post('/jenkins/fooRoomId/fooEnvelopeId')
      .set('User-Agent', 'supertest')
      .send({
        name: 'asgard',
        url: 'job/asgard/',
        build: {
          full_url: `http://localhost:8080/job/asgard/${expectedJobNumber}/`,
          number: expectedJobNumber,
          phase: 'COMPLETED',
          status: 'SUCCESS',
          url: `job/asgard/${expectedJobNumber}/`,
          scm: {
            url: 'https://github.com/evgeny-goldin/asgard.git',
            branch: 'origin/master',
            commit: 'c6d86dc654b12425e706bcf951adfe5a8627a517'
          },
          artifacts: {
            'asgard.war': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard.war`
            },
            'asgard-standalone.jar': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard-standalone.jar`,
              s3: 'https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar'
            }
          }
        }
      });

    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });

  test('when api request to wfapi fails, assume job did not partially fail', async () => {
    jest.spyOn(mockWebex.attachmentActions, 'get').mockResolvedValue({
      inputs: {
        username: 'tester',
        apiKey: 'fooKey',
        jenkinsUrl: 'http://localhost:8080/'
      }
    });
    const app = createMockJenkinsBotApp();
    const expectedJobNumber = MockBuildNumber.WFAPI_ERROR;

    await request(app)
      .post('/jenkins/fooRoomId/fooEnvelopeId')
      .set('User-Agent', 'supertest')
      .send({
        name: 'asgard',
        url: 'job/asgard/',
        build: {
          full_url: `http://localhost:8080/job/asgard/${expectedJobNumber}/`,
          number: expectedJobNumber,
          phase: 'COMPLETED',
          status: 'SUCCESS',
          url: `job/asgard/${expectedJobNumber}/`,
          scm: {
            url: 'https://github.com/evgeny-goldin/asgard.git',
            branch: 'origin/master',
            commit: 'c6d86dc654b12425e706bcf951adfe5a8627a517'
          },
          artifacts: {
            'asgard.war': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard.war`
            },
            'asgard-standalone.jar': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard-standalone.jar`,
              s3: 'https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar'
            }
          }
        }
      });
    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });

  test('when the job is queued, but the build URL does not exist, only show the build number', async () => {
    const app = createMockJenkinsBotApp();
    const expectedJobNumber = 16;

    await request(app)
      .post('/jenkins/fooRoomId')
      .set('User-Agent', 'supertest')
      .send({
        name: 'asgard',
        url: 'job/asgard/',
        build: {
          full_url: null,
          number: expectedJobNumber,
          phase: 'QUEUED',
          status: '',
          url: `job/asgard/${expectedJobNumber}/`,
          scm: {
            url: 'https://github.com/evgeny-goldin/asgard.git',
            branch: 'origin/master',
            commit: 'c6d86dc654b12425e706bcf951adfe5a8627a517'
          },
          artifacts: {
            'asgard.war': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard.war`
            },
            'asgard-standalone.jar': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard-standalone.jar`,
              s3: 'https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar'
            }
          }
        }
      });

    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });

  test('when task is finalized, posts a card', async () => {
    const app = createMockJenkinsBotApp();

    const expectedJobNumber = MockBuildNumber.DEFAULT;

    await request(app)
      .post('/jenkins/fooRoomId')
      .set('User-Agent', 'supertest')
      .send({
        name: 'asgard',
        url: 'job/asgard/',
        build: {
          full_url: `http://localhost:8080/job/asgard/${expectedJobNumber}/`,
          number: expectedJobNumber,
          phase: JenkinsJobPhase.FINALIZED,
          status: JenkinsJobStatus.SUCCESS,
          url: `job/asgard/${expectedJobNumber}/`,
          scm: {},
          artifacts: {
            'asgard.war': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard.war`
            },
            'asgard-standalone.jar': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard-standalone.jar`,
              s3: 'https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar'
            }
          }
        }
      });

    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });

  test('when the job is started, posts a card', async () => {
    const app = createMockJenkinsBotApp();
    const expectedJobNumber = 16;

    await request(app)
      .post('/jenkins/fooRoomId')
      .set('User-Agent', 'supertest')
      .send({
        name: 'asgard',
        url: 'job/asgard/',
        build: {
          full_url: `http://localhost:8080/job/asgard/${expectedJobNumber}/`,
          number: expectedJobNumber,
          phase: 'STARTED',
          status: '',
          url: `job/asgard/${expectedJobNumber}/`,
          scm: {
            url: 'https://github.com/evgeny-goldin/asgard.git',
            branch: 'origin/master',
            commit: 'c6d86dc654b12425e706bcf951adfe5a8627a517'
          },
          artifacts: {
            'asgard.war': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard.war`
            },
            'asgard-standalone.jar': {
              archive: `http://localhost:8080/job/asgard/${expectedJobNumber}/artifact/asgard-standalone.jar`,
              s3: 'https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar'
            }
          }
        }
      });

    expect(mockBot.sendCard.mock.calls).toMatchSnapshot();
  });
});
