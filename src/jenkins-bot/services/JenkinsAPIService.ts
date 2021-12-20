import fetch from 'node-fetch';
import { Commit } from '../templates/JobCompletedTemplate';
import { JenkinsPipelineStageStatus } from '../common/JenkinsPipelineStageStatus';

type JenkinsAPI = (params: JenkinsAPIRequestParams) => Promise<any>;

type JenkinsAPIRequestParams = {
  path: string;
  endpoint: JenkinsRestEndpoint;
  method?: 'get' | 'post';
};

interface JenkinsBuildData {
  commits: Commit[];
}

interface JenkinsStageData {
  status: string;
}

interface JenkinsBuildPipelineInfo {
  hasFailedStage: boolean;
}

enum JenkinsRestEndpoint {
  WFAPI = 'wfapi',
  JSON = 'api/json',
  DEFAULT = ''
}

export default class JenkinsRestAPIService {
  private jenkinsAPI: JenkinsAPI;
  private username: string;
  private apiKey: string;
  private jenkinsUrl: string;

  constructor(jenkinsAPISettingsEnvelopeID: string, webex) {
    this.jenkinsAPI = async ({
      path,
      endpoint = JenkinsRestEndpoint.DEFAULT,
      method = 'get'
    }: JenkinsAPIRequestParams) => {
      if (!this.username || !this.apiKey || !this.jenkinsUrl) {
        try {
          const jenkinsAPISettingsMessage = await webex.attachmentActions.get(
            jenkinsAPISettingsEnvelopeID
          );
          this.username = jenkinsAPISettingsMessage.inputs.username;
          this.apiKey = jenkinsAPISettingsMessage.inputs.apiKey;
          this.jenkinsUrl = jenkinsAPISettingsMessage.inputs.jenkinsUrl;
        } catch (error) {}
      }

      const res = await fetch(this.jenkinsUrl + path + endpoint, {
        method,
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${this.username}:${this.apiKey}`, 'binary').toString(
              'base64'
            )
        }
      });

      let data;
      let text;
      try {
        text = await res.text();
        data = JSON.parse(text);
      } catch (e) {
        // do nothing, it's text probably
      }

      return { data, status: res.status, text };
    };
  }

  async getBuildData(buildUrl): Promise<JenkinsBuildData> {
    const { data } = await this.jenkinsAPI({
      path: buildUrl,
      endpoint: JenkinsRestEndpoint.JSON
    });
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

  async getPipelineBuildData(
    buildPath: string
  ): Promise<JenkinsBuildPipelineInfo> {
    try {
      const { data } = await this.jenkinsAPI({
        path: buildPath,
        endpoint: JenkinsRestEndpoint.WFAPI
      });

      const hasFailedStage = data.stages.some(
        (stage: JenkinsStageData) =>
          stage.status === JenkinsPipelineStageStatus.FAILED
      );

      return { hasFailedStage };
    } catch {
      return { hasFailedStage: false };
    }
  }

  async retryBuild(jobName: string): Promise<void> {
    try {
      await this.jenkinsAPI({
        endpoint: JenkinsRestEndpoint.DEFAULT,
        method: 'post',
        path: `job/${jobName}/build`
      });
    } catch (e) {
      console.log('could not trigger build', e);
    }
  }
}
