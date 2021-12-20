import request from 'supertest';
import { mockBot, mockWebex } from 'webex-node-bot-framework';

import BotApplication from '../../common/BotApplication';
import BotsApplication from '../../common/BotsApplication';
import { handlers } from '../handlers';
import { routes } from '../routes';

import fetch from 'node-fetch';
import { jenkinsCardFormController } from '../controllers';

jest.mock('node-fetch');
jest.mock('webex-node-bot-framework');

function createMockJenkinsBotApp() {
  const jenkinsBot = new BotApplication(
    'jenkins',
    'foo',
    jenkinsCardFormController,
    routes,
    handlers
  );
  return new BotsApplication([jenkinsBot]).expressApp;
}

describe('RetryJenkinsBuild', () => {
  it('calls {jenkinsUrl}/job/{jobName}/build when retryBuild attachmentAction is fired', async () => {
    jest
      .spyOn(mockWebex.attachmentActions, 'get')
      .mockResolvedValueOnce({
        inputs: {
          id: 'retryBuild',
          envelopeId: 'foo-envelopeId',
          jobName: 'foo-jobName'
        }
      })
      .mockResolvedValueOnce({
        inputs: {
          username: 'foo-username',
          apiKey: 'foo-api-key',
          jenkinsUrl: 'foo-url'
        }
      });

    fetch.mockImplementation(() => ({ status: '200' }));

    const app = createMockJenkinsBotApp();

    await request(app)
      .post('/jenkins/')
      .send({ resource: 'attachmentActions', data: { id: 'foo-id' } })
      .set('Accept', 'application/json');

    expect(fetch).toHaveBeenCalledWith('foo-urljob/foo-jobName/build', {
      headers: { Authorization: 'Basic Zm9vLXVzZXJuYW1lOmZvby1hcGkta2V5' },
      method: 'post'
    });
  });
});
