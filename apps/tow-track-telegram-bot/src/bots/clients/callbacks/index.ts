// src/callbacks/index.ts
import { nextStep, updateSession } from '@sessions';
import { answerCallbackQuery, sendMessage, sendReplyKeyboard } from '@utils';
import { help } from './help';
import { createOrder } from './orders';

export default async function(callbackQuery: any, botToken: string, towTrack: Fetcher) {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;
  
  // Сразу отвечаем на callback query, чтобы убрать "часики" у кнопки
  await answerCallbackQuery(botToken, callbackQuery.id);
  
  // Обработка разных типов callback_data
  switch (data) {
    case 'order':
      await createOrder(chatId, botToken);
      break;
    case 'city':
      case 'intercity': {
        const isIntercity = data === 'intercity';
        updateSession(chatId, { intercity: isIntercity });
        nextStep(chatId); // теперь step станет 1
      
        if (isIntercity) {
          await sendMessage(botToken, chatId, 'Тип доставки: Межгород');
        } else {
          await sendMessage(botToken, chatId, 'Тип доставки: Город');
        }
      
        await sendMessage(botToken, chatId, 'Откуда забирать машину?');
        break;
      }
        
    case 'help':
      await help(chatId, botToken);
      break;
    default:
      // Если данные callback содержат префикс и значение
      if (data.includes(':')) {
        const [action, value] = data.split(':');
        //await handleParametrizedCallback(chatId, action, value, botToken, towTrack);
      } else {
        await sendMessage(botToken, chatId, 'Неизвестный тип обратного вызова.');
      }
  }
}
