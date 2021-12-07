require('dotenv').config();
import jenkinsBot from './jenkins-bot';
import githubEnterpriseBot from './github-enterprise-bot';
import BotsApplication from './common/BotsApplication';

const botsApplication = new BotsApplication([jenkinsBot, githubEnterpriseBot]);

botsApplication.listen(process.env.PORT);

// gracefully shutdown (ctrl-c)
process.on('SIGINT', () => {
  botsApplication.shutdown();
});
