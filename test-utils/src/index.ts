require('dotenv').config();
import { GitHubEnterpriseTestUtilities } from './git-test-utils';

const available_commands = {
  'create new issue': { method: 'createNewIssue', args: [process.argv[3]] },
  'open pull request': { method: 'openPullRequest', args: [] },
  'mock commits': {
    method: 'nCommitsToBranch',
    args: [process.argv[3], process.argv[4]]
  }
};

export default (async function () {
  const command = process.argv[2];

  if (!command) {
    console.error(
      'please include a command, e.g. npm run test-util "open pull request"'
    );
    process.exit(1);
  }

  const { TEST_GIT_REPOSITORY, GITHUB_ACCESS_TOKEN } = process.env;
  if (!TEST_GIT_REPOSITORY || !GITHUB_ACCESS_TOKEN) {
    console.error(
      'ensure TEST_GIT_REPOSITORY and GITHUB_ACCESS_TOKEN are included in your .env'
    );
    process.exit(1);
  }

  const gitTestUtils = new GitHubEnterpriseTestUtilities(
    TEST_GIT_REPOSITORY!,
    GITHUB_ACCESS_TOKEN!
  );

  const commands = {};
  Object.entries(available_commands).forEach(([key, value]) => {
    commands[key] = [gitTestUtils[value.method], value.args];
  });

  if (command && !!commands[command]) {
    const [method, args] = commands[command];
    try {
      await gitTestUtils.initialize();
      await method.bind(gitTestUtils)(...args);
      console.log('command succeeded');
    } catch (e) {
      console.error('command failed');
      console.error(e);
      process.exit(1);
    }
  } else {
    console.error(
      `command "${command}" not recognized. available commands are:\n${Object.keys(
        commands
      ).join('"\n"')}`
    );
  }
})();
