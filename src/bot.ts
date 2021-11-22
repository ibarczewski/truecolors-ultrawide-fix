import Framework from 'webex-node-bot-framework';
import webhook from 'webex-node-bot-framework/webhook';
import express from 'express';
import {
  IssueAssignedNotification,
  IssueAssignedNotificationData
} from './cards/IssueAssignedNotification/IssueAssignedNotification';

export type Bot = {
  sendCard(template: string): () => void;
};

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// init framework
const framework = new Framework({
  webhookUrl: process.env.FRAMEWORK_WEBHOOK_URL,
  token: process.env.FRAMEWORK_TOKEN,
  port: process.env.PORT
});
framework.start();

console.log('Starting framework, please wait....');

framework.on('initialized', () => {
  console.log('framework is all fired up! [Press CTRL-C to quit]');
});

// A spawn event is generated when the framework finds a space with your bot in it
// If actorId is set, it means that user has just added your bot to a new space
// If not, the framework has discovered your bot in an existing space
framework.on('spawn', (bot, id, actorId) => {
  if (!actorId) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    console.log(
      `While starting up, the framework found our bot in a space called: ${bot.room.title}`
    );
  } else {
    // When actorId is present it means someone added your bot got added to a new space
    // Lets find out more about them..
    let msg =
      'You can say `help` to get the list of words I am able to respond to.';
    bot.webex.people
      .get(actorId)
      .then((user) => {
        msg = `Hello there ${user.displayName}. ${msg}`;
      })
      .catch((e) => {
        console.error(
          `Failed to lookup user details in framwork.on("spawn"): ${e.message}`
        );
        msg = `Hello there. ${msg}`;
      })
      .finally(() => {
        // Say hello, and tell users what you do!
        if (bot.isDirect) {
          bot.say('markdown', msg);
        } else {
          const botName = bot.person.displayName;
          msg += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@mention* ${botName}.`;
          bot.say('markdown', msg);
        }
      });
  }
});

// Process incoming messages

let responded = false;

framework.hears('get webhook url', (bot) => {
  try {
    responded = true;
    bot.say(
      `your webhook url is ${process.env.FRAMEWORK_WEBHOOK_URL}/${bot.room.id}`
    );
  } catch (error) {
    console.log(error);
  }
});

function sendHelp(bot) {
  bot.say(
    'markdown',
    'These are the commands I can respond to:',
    '\n\n ' +
      '1. **get webhook url**   (get your webhook url) \n' +
      '2. **help** (what you are reading now)'
  );
}

/* On mention with command
ex User enters @botname help, the bot will write back in markdown
*/
framework.hears(
  /help|what can i (do|say)|what (can|do) you do/i,
  (bot, trigger) => {
    console.log(`someone needs help! They asked ${trigger.text}`);
    responded = true;
    bot
      .say(`Hello ${trigger.person.displayName}.`)
      .then(() => sendHelp(bot))
      .catch((e) => console.error(`Problem in help hander: ${e.message}`));
  }
);

/* On mention with unexpected bot command
   Its a good practice is to gracefully handle unexpected input
*/
framework.hears(/.*/, (bot, trigger) => {
  // This will fire for any input so only respond if we haven't already
  if (!responded) {
    console.log(`catch-all handler fired for user input: ${trigger.text}`);
    bot
      .say(`Sorry, I don't know how to respond to "${trigger.text}"`)
      .then(() => sendHelp(bot))
      .catch((e) =>
        console.error(`Problem in the unexepected command hander: ${e.message}`)
      );
  }
  responded = false;
});

// Server config & housekeeping
// Health Check
app.get('/', (req, res) => {
  res.send(`I'm alive.`);
});

const issueAssignedNotification = new IssueAssignedNotification();

app.post('/:roomId', (req, res) => {
  const bot: Bot = framework.getBotByRoomId(req.params.roomId);
  if (bot) {
    try {
      const { issue, sender, assignee, repository } = req.body;
      issueAssignedNotification.send(bot, {
        assignedByName: sender.login,
        assignedByURL: sender.html_url,
        assigneeName: assignee.login,
        assigneeURL: assignee.html_url,
        issueNumber: issue.number,
        issueTitle: issue.title,
        issueURL: issue.html_url,
        repositoryURL: repository.html_url,
        repositoryName: repository.name
      } as IssueAssignedNotificationData);
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('could not find bot');
  }

  res.end();
});

app.post('/', webhook(framework));

export default app;
export { framework };
