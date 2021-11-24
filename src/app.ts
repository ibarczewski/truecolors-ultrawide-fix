import express from 'express';
import jenkinsBot from './jenkins-bot';
import githubBot from './github-enterprise-bot';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

jenkinsBot.start();
githubBot.start();

app.use('/jenkins', jenkinsBot.router);
app.use('/github', githubBot.router);

export default app;
