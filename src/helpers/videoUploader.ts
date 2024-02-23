import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';

export async function sendLargeDocument(
  chatId: string | number,
  path: string,
): Promise<any> {
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('document', createReadStream(path));
  formData.append('supports_streaming', 'true');
  return await axios
    .post(
      `http://127.0.0.1:8081/bot${process.env.BOT_TOKEN}/sendDocument`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        maxContentLength : Infinity,
        maxBodyLength : Infinity,
      },
    )
}
