import Framework from 'webex-node-bot-framework';
import webhook from 'webex-node-bot-framework/webhook';
import { Router } from 'express';
// todo - this should probably be a constructor argument
import { frameworks } from '../frameworks';

export class BotFramework {
  private framework;
  private responded;
  private slug;
  constructor(slug: string, token: string, router: Router) {
    this.slug = slug;
    this.responded = false;
    this.framework = new Framework({
      webhookUrl: process.env.FRAMEWORK_WEBHOOK_URL + '/' + slug,
      token,
      port: process.env.PORT
    });

    frameworks.add(this.framework);

    this.framework.start();

    this.catchAll();
    this.initializer();

    router.post('/', webhook(this.framework));
    router.get('/', (req, res) => {
      res.send(this.slug + 'is alive.');
    });
  }

  public use(fn) {
    fn(this.framework);
  }

  private initializer() {
    this.framework.on('initialized', () => {
      console.log(this.slug, 'framework is all fired up!');
    });
  }

  private catchAll() {
    this.framework.hears(/.*/, (bot, trigger) => {
      // This will fire for any input so only respond if we haven't already
      if (!this.responded) {
        console.log(`catch-all handler fired for user input: ${trigger.text}`);
        bot
          .say(`Sorry, I don't know how to respond to "${trigger.text}"`)
          // .then(() => sendHelp(bot))
          .catch((e) =>
            console.error(
              `Problem in the unexepected command hander: ${e.message}`
            )
          );
      }
      this.responded = false;
    });
  }

  public hears(...args) {
    this.responded = true;
    this.framework.hears(...args);
  }

  public getBotByRoomId(...args) {
    return this.framework.getBotByRoomId(...args);
  }
  public debug(...args) {
    console.log(args);
    this.framework.debug(...args);
  }
  public stop() {
    console.log('stopping');
    return this.framework.stop();
  }
}
