import Framework from 'webex-node-bot-framework';
import webhook from 'webex-node-bot-framework/webhook';
import { Request, Response, Router } from 'express';
import { Bot } from './Bot';
import BotCardFormController from './BotCardFormController';

export interface BotRoute {
  action: 'get' | 'post';
  path: string;
  controller: BotRouteController;
}

export interface BotRouteController {
  execute: (
    req: Request,
    res: Response,
    botApplication: BotApplication
  ) => void;
}

export interface BotHandler {
  command: string;
  handler: (bot: Bot, ...rest) => void;
}
export default class BotApplication {
  private framework: Framework;
  private responded: boolean;
  public slug: string;
  private commands: string[];
  public router: Router;
  private formController: BotCardFormController;
  constructor(
    slug: string,
    token: string,
    formController: BotCardFormController,
    routes?: BotRoute[],
    handlers?: BotHandler[]
  ) {
    this.router = Router();
    this.slug = slug;
    this.commands = [];
    this.responded = false;
    this.framework = new Framework({
      webhookUrl: process.env.FRAMEWORK_WEBHOOK_URL + '/' + slug,
      token,
      port: process.env.PORT
    });
    this.formController = formController;

    this.initializer();

    const attachmentActionsMiddleware = (req, res, next) => {
      if (req.body.resource === 'attachmentActions') {
        this.formController?.execute(req.body, this);
      }
      next();
    };

    this.router.post('/', attachmentActionsMiddleware, webhook(this.framework));
    this.router.get('/', (req, res) => {
      res.send(this.slug + 'is alive.');
    });

    routes.forEach((route) => {
      this.router[route.action](route.path, (req, res) => {
        route.controller.execute(req, res, this);
      });
    });

    handlers.forEach((handler) => {
      this.hears(handler.command, handler.handler);
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

  public start() {
    this.catchAll();
    this.framework.start();
  }

  private catchAll() {
    this.framework.hears(/.*/, (bot, trigger) => {
      // This will fire for any input so only respond if we haven't already
      if (!this.responded) {
        console.log(`catch-all handler fired for user input: ${trigger.text}`);
        bot
          .say(`Sorry, I don't know how to respond to "${trigger.text}"`)
          .then(() =>
            bot.say(
              'markdown',
              `but I do know how to respond to \n${this.commands
                .map((command) => `* ${command}\n`)
                .join('')}`
            )
          )
          .catch((e) =>
            console.error(
              `Problem in the unexepected command hander: ${e.message}`
            )
          );
      }
      this.responded = false;
    });
  }

  private hears(command, fn, ...rest) {
    this.commands.push(command);
    this.framework.hears(
      command,
      (...args) => {
        this.responded = true;
        fn(...args);
      },
      ...rest
    );
  }
  public getBotByRoomId(...args) {
    return this.framework.getBotByRoomId(...args);
  }
  public debug(...args) {
    console.log(args);
    this.framework.debug(...args);
  }
  public stop() {
    return this.framework.stop();
  }

  public getWebexSDK() {
    return this.framework.getWebexSDK();
  }
}