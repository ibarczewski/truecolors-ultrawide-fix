require('dotenv').config();
import { frameworks } from './frameworks';
import app from './app';

const server = app.listen(process.env.PORT, () => {
  frameworks.current.forEach((framework) => {
    framework.debug('framework listening on port %s', process.env.PORT);
  });
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', () => {
  frameworks.current.forEach((framework) => {
    framework.debug('stoppping...');
  });
  server.close();
  Promise.all(frameworks.current.map((framework) => framework.stop)).then(
    () => {
      process.exit();
    }
  );
});
