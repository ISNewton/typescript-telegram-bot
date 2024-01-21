import { Context, Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
dotenv.config()

const bot: Telegraf<Context> = new Telegraf(process.env.BOT_TOKEN as string);


bot.start((ctx) => {
  ctx.reply('Hello ' + ctx.from.first_name + '!');
});

bot.launch();
