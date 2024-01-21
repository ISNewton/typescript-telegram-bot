import { Context, Markup, Telegraf } from "telegraf";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const bot: Telegraf<Context> = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx) => {
  ctx.reply(
    `Hi ${ctx.from.first_name} \nChoose an option:`,
    Markup.inlineKeyboard([
      Markup.button.callback("Get available students", "getAvailableStudents"),
    ])
  );
});

bot.action("getAvailableStudents", async (ctx) => {
  ctx.editMessageText({
    text: "Loading students...",
  });

  try {
    const response = await axios.get(
      `${process.env.UNISOFT_BASE_URL}/students`
    );

    let message = "Students registered in UniSoft:";

    response.data.students.map((name: any, key: any) => {
      message += `\n ${key + 1} ${name}`;
    });

    ctx.editMessageText({
      text: message,
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      ctx.editMessageText({
        text: 'Error with the code: ' + error.code ?? 'UNKNOWN ERROR CODE',
      });
      console.log(error)
    }

    ctx.editMessageText({
      text: 'Something went wrong ,try later.',
    });

    console.log(error)

  }
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
