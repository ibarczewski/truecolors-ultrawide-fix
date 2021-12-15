import simpleGit, { SimpleGit } from 'simple-git';
import fs from 'fs';
import fetch from 'node-fetch';
import faker from 'faker';

type GithubAPI = (args: {
  path: string;
  method?: 'get' | 'post' | 'delete';
  body?: any;
}) => Promise<any>;

export interface GitTestUtilities {
  openPullRequest: () => void;
}

export class GitHubEnterpriseTestUtilities implements GitTestUtilities {
  private repoURL: string;
  private git: SimpleGit;
  private repoOrgURL: string;
  private repoOwner: string;
  private repoName: string;
  private githubAPI: GithubAPI;
  constructor(repoURL: string, accessToken: string) {
    this.repoURL = repoURL;

    this.repoOrgURL = /(?<=\@)(.*?)(?=\:)/.exec(repoURL)[0];
    this.repoOwner = /(?<=\:)(.*?)(?=\/)/.exec(repoURL)[0];
    this.repoName = /(?<=\/)(.*?)(?=\.)/.exec(repoURL)[0];

    this.githubAPI = async ({ path, method, body }) => {
      const response = await fetch(
        `https://${this.repoOrgURL}/api/v3/repos/${this.repoOwner}/${this.repoName}${path}`,
        {
          headers: {
            authorization: `token ${accessToken}`
          },
          method,
          ...(body && { body: JSON.stringify(body) })
        }
      );

      const data = await response.json();
      const result = {
        data,
        status: response.status
      };
      return result;
    };
  }
  public async initialize() {
    fs.rmSync('./tmp-git', { recursive: true, force: true });
    fs.mkdirSync('./tmp-git');
    this.git = simpleGit('./tmp-git');
    await this.git.clone(this.repoURL, './test-repo');
  }

  public async openPullRequest() {
    try {
      const baseBranch = faker.git.branch();
      const headBranch = faker.git.branch();
      const git = simpleGit('./tmp-git/test-repo');

      await git.checkoutBranch(baseBranch, 'origin/master');
      await git.push('origin', baseBranch);

      await git.checkoutBranch(headBranch, baseBranch);

      fs.writeFileSync('./tmp-git/test-repo/tester.txt', 'making it better');
      await git.add('tester.txt');

      await git.commit(faker.git.commitMessage());
      await git.push('origin', headBranch);

      const res = await this.githubAPI({
        method: 'post',
        path: '/pulls',
        body: {
          head: headBranch,
          base: baseBranch,
          title: faker.git.commitMessage()
        }
      });

      // cleanup
      await git.push('origin', headBranch, ['--delete']);
      await git.push('origin', baseBranch, ['--delete']);
    } catch (err) {
      console.log(err);
    }
  }

  public async createNewIssue(assignees: string) {
    const assigneesArray = assignees.split(',');
    console.log(assigneesArray);
    if (assigneesArray.length === 0) {
      console.info('creating new issue with no assignees');
      console.info(
        'if you wanted to add an assignee, run the command with an array of usernames, e.g. npm run test-util "create new issue" "username1,username2"'
      );
    }
    const newIssueRes = await this.githubAPI({
      method: 'post',
      path: '/issues',
      body: {
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        assignees: assigneesArray
      }
    });

    console.log(newIssueRes.status);
  }

  public async nCommitsToBranch(n: number, branch: string) {
    console.log(`committing ${n} changes to ${branch}`);
    const git = simpleGit('./tmp-git/test-repo');

    await git.checkoutBranch(branch, `origin/${branch}`);
    for (let i = 0; i < n; i++) {
      fs.writeFileSync(
        './tmp-git/test-repo/tester.txt',
        faker.lorem.paragraph()
      );
      await git.add('tester.txt');
      await git.commit(faker.git.commitMessage());
    }

    await git.push('origin', branch, ['--force']);
  }
}
