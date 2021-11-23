import express from 'express';
import { router as jenkinsBot } from './jenkins-bot';
import { router as githubBot } from './github-enterprise-bot';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/jenkins', jenkinsBot);
app.use('/github', githubBot);

export default app;
