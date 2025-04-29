// src/auth/auth.callback.ts
import { startSession } from '@sessions';
import { sendMessage } from '@utils';

export async function registerCallback(chatId: number, botToken: string) {
  // Шаг 1: инициализируем сессию на step = 1
  startSession(chatId);

  // Первый вопрос — «Как вас зовут?»
  await sendMessage(botToken, chatId, 'Как Вас зовут?');
}
