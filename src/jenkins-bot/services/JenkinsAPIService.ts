import fetch from 'node-fetch';

type JenkinsAPI = (params: { path: string }) => Promise<any>;

interface JenkinsBuildData {
  numberOfGitChanges: number;
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
      console.log(data);
      return { data, status: res.status };
    };
  }

  async getBuildData(buildUrl): Promise<JenkinsBuildData> {
    const { data } = await this.jenkinsAPI({ path: buildUrl });
    const numberOfGitChanges = data.changeSets?.find(
      (changeSet) => changeSet.kind === 'git'
    )?.items?.length;

    return {
      numberOfGitChanges
    };
  }
}
