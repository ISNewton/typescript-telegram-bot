import axios from "axios";
import FormData from "form-data";
import { createReadStream, fstat } from "fs";
import fs from "fs";
import { Context } from "telegraf";

export async function sendLargeDocument(
  ctx: Context,
  path: string
): Promise<any> {
  const totalSize = await fs.promises.stat(path).then((stats) => stats.size);

  const formData = new FormData();
  formData.append("chat_id", ctx.chat?.id);
  formData.append("document", createReadStream(path) , {
    contentType: 'application/octet-stream', // Generic content type
    knownLength: totalSize, // Provide total size for progress tracking
  });
  formData.append("supports_streaming", "true");
  return await axios.post(
    `http://127.0.0.1:8081/bot${process.env.BOT_TOKEN}/sendDocument`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      validateStatus: (status) => status < 500, // Handle non-400 errors
      onUploadProgress: async (progressEvent) => {
        // Optional: Track upload progress and report to user
        const percentage = Math.round((progressEvent.loaded * 100) / totalSize);

        await ctx.reply(`
                  Downloded : ${progressEvent.loaded}
                  Upload progress: ${percentage}%
                  `);
      },
    }
  );
}
