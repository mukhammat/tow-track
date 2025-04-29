import { sendKeyboard, sendMessage } from '@utils';

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

export async function start(chatId: number, userId: number, botToken: string) {
    const welcomeMessage = `
    Привет! 👋 Я бот для работы с вашим сервисом.

    Используйте /help для получения списка доступных команд.
    `;

    const keyboard = [
        [{ text: "Регистрация", callback_data: "register" }],
    ];

    await sendKeyboard(botToken, chatId, welcomeMessage, keyboard);
}


export async function help(chatId: number, botToken: string) {
    const helpMessage = `
  Доступные команды:
  
  /start - Запустить бота
  /help - Показать список команд
    `;
    
    await sendMessage(botToken, chatId, helpMessage);
}