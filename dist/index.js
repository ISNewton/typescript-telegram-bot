"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const dotenv = __importStar(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
// import fs from 'fs/promises'
const fs_1 = __importDefault(require("fs"));
dotenv.config();
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
let awaitingFileUrl = false; // Flag to track file URL expectation
bot.start((ctx) => {
    ctx.reply(`Hi ${ctx.from.first_name} \nChoose an option:`, telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("Upload a file from url", "uploadUrlFile"),
    ]));
});
bot.action("uploadUrlFile", async (ctx) => {
    awaitingFileUrl = true;
    ctx.reply("Send a direct url");
});
bot.on("message", async (ctx) => {
    if (!awaitingFileUrl) {
        return;
    }
    await bot.telegram.sendDocument(ctx.chat.id, {
        source: 'file.mp4',
    });
    ctx.reply('ended');
    return;
    // @ts-ignore
    const url = ctx.message?.text;
    const response = await axios_1.default.get(url, {
        responseType: "stream",
    });
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];
    const extension = filename.split(".").pop() || ""; // Handle cases without extensions
    const fullFileName = `file.${extension}`;
    if (extension == "") {
        return ctx.reply("File does not have an extension.");
    }
    let fileStream;
    try {
        fileStream = response.data.pipe(fs_1.default.createWriteStream(fullFileName));
    }
    catch (error) {
        console.log(error);
        ctx.reply('Error reading file url.');
        return;
    }
    fileStream.on("finish", async () => {
        await bot.telegram.sendDocument(ctx.chat.id, {
            source: fullFileName,
        });
        ctx.reply("ended");
        fs_1.default.stat(fullFileName, (error) => {
            if (error) {
                console.log(error);
                return;
            }
            fs_1.default.promises.unlink(fullFileName); // Delete the file after sending
        });
        awaitingFileUrl = false;
    });
});
bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
//# sourceMappingURL=index.js.map