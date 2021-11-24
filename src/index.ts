require('dotenv').config();
import frameworksCollection from './frameworksCollection';
import app from './app';

const server = app.listen(process.env.PORT, () => {
  frameworksCollection.current.forEach((framework) => {
    framework.debug('framework listening on port %s', process.env.PORT);
  });
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', () => {
  frameworksCollection.current.forEach((framework) => {
    framework.debug('stoppping...');
  });
  server.close();
  Promise.all(
    frameworksCollection.current.map((framework) => framework.stop)
  ).then(() => {
    process.exit();
  });
});
