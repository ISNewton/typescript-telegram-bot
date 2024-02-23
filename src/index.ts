import { Context, Markup, Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import axios from "axios";
import { sendLargeDocument } from './helpers/videoUploader'
// import fs from 'fs/promises'
import fs from "fs";
dotenv.config();

const bot: Telegraf<Context> = new Telegraf(process.env.BOT_TOKEN as string);

let awaitingFileUrl = false; // Flag to track file URL expectation

bot.start((ctx) => {
  ctx.reply(
    `Hi ${ctx.from.first_name} \nChoose an option:`,
    Markup.inlineKeyboard([
      Markup.button.callback("Upload a file from url", "uploadUrlFile"),
    ])
  );
});

bot.action("uploadUrlFile", async (ctx) => {
  awaitingFileUrl = true
  ctx.reply("Send a direct url");

});

bot.on("message", async (ctx) => {
  if (!awaitingFileUrl) {
    return;
  }


  // @ts-ignore
  const url = ctx.message?.text;
  const urlParts = url.split("/");
  const filename = urlParts[urlParts.length - 1];
  const extension = filename.split(".").pop() || ""; // Handle cases without extensions

  const fullFileName = `file.${extension}`


  if (extension == "") {
    return ctx.reply("File does not have an extension.");
  }

  const response = await axios.get(url, {
    responseType: "stream",
  });

  let fileStream
  try {
    ctx.reply('Reading file.')
    fileStream = response.data.pipe(
      fs.createWriteStream(fullFileName)
    );

  }

  catch (error) {

    console.log(error)
    ctx.reply('Error reading file url.')

    return
  }


  fileStream.on("finish", async () => {
    ctx.reply('Reading file Completed.')
      ctx.reply('Sending file.')
      try {
        await sendLargeDocument(ctx, fullFileName)

        ctx.reply('Sending file Completed.')
      }
      catch (error) {
        console.log('sendLargeDocument error')

        ctx.reply("Failed to upload the file .");
        return
      }

      fs.stat(fullFileName, (error) => {
        if (error) {
          console.log(error)
          return
        }

        fs.promises.unlink(fullFileName); // Delete the file after sending
      })
      awaitingFileUrl = false;
    });
});


bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
