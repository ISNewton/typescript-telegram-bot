import { Context, Telegraf } from 'telegraf';
// import { Update } from 'typegram';
const bot: Telegraf<Context> = new Telegraf(process.env.BOT_TOKEN as string);
bot.start((ctx) => {
  ctx.reply('Hello ' + ctx.from.first_name + '!');
});

bot.launch();
