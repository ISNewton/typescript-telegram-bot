"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
// import { Update } from 'typegram';
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
// '6661235555:AAEFqSBJkRMLq2ZctZ123K6cdAX8u6OZusY'
bot.start((ctx) => {
    ctx.reply('Hello ' + ctx.from.first_name + '!');
});
bot.launch();
//# sourceMappingURL=index.js.map