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
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
    ctx.reply(`Hi ${ctx.from.first_name} \nChoose an option:`, telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("Get available students", "getAvailableStudents"),
    ]));
});
bot.action("getAvailableStudents", async (ctx) => {
    ctx.editMessageText({
        text: "Loading students...",
    });
    try {
        const response = await axios_1.default.get(`${process.env.UNISOFT_BASE_URL}/students`);
        let message = "Students registered in UniSoft:";
        response.data.students.map((name, key) => {
            message += `\n ${key + 1} ${name}`;
        });
        ctx.editMessageText({
            text: message,
        });
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            ctx.editMessageText({
                text: 'Error with the code: ' + error.code ?? 'UNKNOWN ERROR CODE',
            });
            console.log(error);
        }
        ctx.editMessageText({
            text: 'Something went wrong ,try later.',
        });
        console.log(error);
    }
});
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//# sourceMappingURL=index.js.map