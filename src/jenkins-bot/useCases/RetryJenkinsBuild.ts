import JenkinsRestAPIService from '../services/JenkinsAPIService';

interface RetryJenkinsBuildDTO {
  jenkinsAPI: JenkinsRestAPIService;
  jobName: string;
}

export default class RetryJenkinsBuild {
  execute(request: RetryJenkinsBuildDTO) {
    request.jenkinsAPI.retryBuild(request.jobName);
  }
}
