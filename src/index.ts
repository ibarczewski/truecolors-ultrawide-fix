require('dotenv').config();
import app, { framework } from './bot';

const server = app.listen(process.env.PORT, () => {
  framework.debug('framework listening on port %s', process.env.PORT);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', () => {
  framework.debug('stoppping...');
  server.close();
  framework.stop().then(() => {
    process.exit();
  });
});
