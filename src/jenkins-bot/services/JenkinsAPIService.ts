import fetch from 'node-fetch';
import { Commit } from '../templates/JobCompletedTemplate';
import { JenkinsPipelineStageStatus } from '../useCases/JenkinsPipelineStageStatus';

type JenkinsAPI = (params: { path: string; isWfapi: boolean }) => Promise<any>;

interface JenkinsBuildData {
  commits: Commit[];
}

interface JenkinsStageData {
  status: string;
}

interface JenkinsBuildPipelineInfo {
  hasFailedStage: boolean;
}

export default class JenkinsRestAPIService {
  private jenkinsAPI: JenkinsAPI;
  private username: string;
  private apiKey: string;
  private jenkinsUrl: string;

  constructor(jenkinsAPISettingsEnvelopeID: string, webex) {
    this.jenkinsAPI = async ({ path, isWfapi }) => {
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

      const route = isWfapi ? 'wfapi' : 'api/json';

      const res = await fetch(this.jenkinsUrl + path + route, {
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
    const { data } = await this.jenkinsAPI({ path: buildUrl, isWfapi: false });
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
        isWfapi: true
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
