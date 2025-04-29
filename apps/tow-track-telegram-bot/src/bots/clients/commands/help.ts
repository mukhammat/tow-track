import { sendMessage } from '@utils';

export async function help(chatId: number, botToken: string) {
    const helpMessage = `
  Доступные команды:
  
  /start - Запустить бота
  /help - Показать список команд
    `;
    
    await sendMessage(botToken, chatId, helpMessage);
}