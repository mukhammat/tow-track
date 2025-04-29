// src/callbacks/index.ts
import { answerCallbackQuery, sendMessage } from '@utils';
import { registerCallback } from "./auth/auth.callback"

export default async function(callbackQuery: any, botToken: string, towTrack: Fetcher) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  
  await answerCallbackQuery(botToken, callbackQuery.id);
  
  // Обработка разных типов callback_data
  switch (data) {
    case 'register':
      await  registerCallback(chatId, botToken);
      break;
    default:
      if (data.includes(':')) {
        const [action, value] = data.split(':');
      } else {
        await sendMessage(botToken, chatId, 'Неизвестный тип обратного вызова.');
      }
  }
}
