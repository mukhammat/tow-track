import { sendMessage } from '@utils';
import { start } from "./start"
import { help } from "./help";

export default async function (
    message: any, 
    command: string, 
    args: string[], 
    botToken: string, 
    towTrack: Fetcher
  ) {
    const chatId = message.chat.id;
    const userId = message.from.id;
    
    switch (command) {
      case 'start':
        await start(chatId, userId, botToken);
        break;
        
      case 'help':
        await help(chatId, botToken);
        break;
        
      default:
        await sendMessage(botToken, chatId, 'Неизвестная команда. Используйте /help для получения списка команд.');
    }
  }