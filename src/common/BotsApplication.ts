import express from 'express';
import BotApplication from './BotApplication';

export default class BotsApplication {
  public expressApp;
  private server;
  private runningBotApplications: BotApplication[] = [];
  constructor(botApplications: BotApplication[]) {
    this.expressApp = express();
    this.expressApp.use(express.urlencoded({ extended: true }));
    this.expressApp.use(express.json());

    botApplications.forEach((botApplication) => {
      botApplication.start();
      this.expressApp.use('/' + botApplication.slug, botApplication.router);
      this.runningBotApplications.push(botApplication);
    });
  }

  public listen(port) {
    this.expressApp.listen(port, () => {
      this.runningBotApplications.forEach((botApplication) => {
        botApplication.debug('botApplication listening on port %s', port);
      });
    });
  }

  public shutdown() {
    this.runningBotApplications.forEach((botApplication) => {
      botApplication.debug('stoppping...');
    });
    this.server.close();
    Promise.all(
      this.runningBotApplications.map((framework) => framework.stop)
    ).then(() => {
      process.exit();
    });
  }
}
