import { sendKeyboard } from '@utils';
import { startSession, updateSession } from '@sessions';

export async function createOrder(chatId: number, botToken: string) {
  startSession(chatId); // Стартуем новую сессию

  updateSession(chatId, { step: 0 }); // Добавим step = 0 (будем знать, что еще не выбрали город/межгород)

  await sendKeyboard(botToken, chatId, 'Выберите тип доставки:', [
    [
      { text: 'Город', callback_data: 'city' },
      { text: 'Межгород', callback_data: 'intercity' }
    ]
  ]);
}

