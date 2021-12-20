import fetch from 'node-fetch';
import { Commit } from '../templates/JobCompletedTemplate';
import { JenkinsPipelineStageStatus } from '../common/JenkinsPipelineStageStatus';

type JenkinsAPI = (params: {
  path: string;
  endpoint: JenkinsRestEndpoint;
}) => Promise<any>;

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
  JSON = 'api/json'
}

export default class JenkinsRestAPIService {
  private jenkinsAPI: JenkinsAPI;
  private username: string;
  private apiKey: string;
  private jenkinsUrl: string;

  constructor(jenkinsAPISettingsEnvelopeID: string, webex) {
    this.jenkinsAPI = async ({
      path,
      endpoint
    }: {
      path: string;
      endpoint: JenkinsRestEndpoint;
    }) => {
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
}
