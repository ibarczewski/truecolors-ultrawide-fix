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
  private githubAPI: GithubAPI;
  constructor(repoURL: string, accessToken: string) {
    const [, , protocol, , domain, , owner, repo] =
      /((git@|http(s)?:\/\/)([\w\.@]+)(\/|:))([\w,\-,\_]+)\/([\w,\-,\_]+)(.git){0,1}((\/){0,1})/.exec(
        repoURL
      );

    this.repoURL = `${protocol}${accessToken}@${domain}/${owner}/${repo}.git`;

    this.githubAPI = async ({ path, method, body }) => {
      const response = await fetch(
        `${protocol}${domain}/api/v3/repos/${owner}/${repo}${path}`,
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
    await this.git.clone(this.repoURL, './test-repo', {});
    this.git = simpleGit('./tmp-git/test-repo');
    await this.git.addConfig(
      'user.name',
      faker.internet.userName(),
      false,
      'local'
    );
    await this.git.addConfig(
      'user.email',
      faker.internet.email(),
      false,
      'local'
    );
  }

  public async openPullRequest() {
    let headBranch;
    let baseBranch;
    try {
      baseBranch = faker.git.branch();
      headBranch = faker.git.branch();

      await this.git.checkoutBranch(baseBranch, 'origin/master');
      await this.git.push('origin', baseBranch);

      await this.git.checkoutBranch(headBranch, baseBranch);

      fs.writeFileSync('./tmp-git/test-repo/tester.txt', 'making it better');
      await this.git.add('tester.txt');

      await this.git.commit(faker.git.commitMessage());
      await this.git.push('origin', headBranch);

      const res = await this.githubAPI({
        method: 'post',
        path: '/pulls',
        body: {
          head: headBranch,
          base: baseBranch,
          title: faker.git.commitMessage()
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      // cleanup
      await this.git.push('origin', headBranch, ['--delete']);
      await this.git.push('origin', baseBranch, ['--delete']);
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

    await this.git.checkoutBranch(branch, 'origin/main');

    for (let i = 0; i < n; i++) {
      fs.writeFileSync(
        './tmp-git/test-repo/tester.txt',
        faker.lorem.paragraph()
      );
      await this.git.add('tester.txt');
      await this.git.commit(faker.git.commitMessage());
    }

    await this.git.push('origin', branch, ['--force']);
  }
}
