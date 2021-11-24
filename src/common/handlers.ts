export const commonHelpFunction = (welcome) => (framework) => {
  framework.hears('help me', (bot) => {
    bot.say('i ma here to help', welcome);
  });
};
