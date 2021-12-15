import fetch from 'node-fetch';
import { Commit } from '../templates/JobCompletedTemplate';

type JenkinsAPI = (params: { path: string }) => Promise<any>;

interface JenkinsBuildData {
  commits: Commit[];
}

export default class JenkinsRestAPIService {
  private jenkinsAPI: JenkinsAPI;
  private username: string;
  private apiKey: string;

  constructor(jenkinsAPISettingsEnvelopeID: string, webex) {
    this.jenkinsAPI = async ({ path }) => {
      if (!this.username || !this.apiKey) {
        try {
          const jenkinsAPISettingsMessage = await webex.attachmentActions.get(
            jenkinsAPISettingsEnvelopeID
          );
          this.username = jenkinsAPISettingsMessage.inputs.username;
          this.apiKey = jenkinsAPISettingsMessage.inputs.apiKey;
        } catch (error) {
          console.log(error);
        }
      }

      const res = await fetch(path + 'api/json', {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${this.username}:${this.apiKey}`, 'binary').toString(
              'base64'
            )
        }
      });
      const data = await res.json();
      return { data, status: res.status };
    };
  }

  async getBuildData(buildUrl): Promise<JenkinsBuildData> {
    const { data } = await this.jenkinsAPI({ path: buildUrl });

    const commits: Commit[] = data.changeSet?.items?.map((changeSetItem) => {
      return {
        sha: changeSetItem.id,
        author: changeSetItem.author.fullName,
        authorEmail: changeSetItem.authorEmail,
        message: changeSetItem.msg
      };
    });

    return {
      commits
    };
  }
}
