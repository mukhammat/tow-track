// src/auth/auth.message.ts
import { sendKeyboard, sendMessage } from "@utils";
import { getSession, updateSession, nextStep, endSession } from "@sessions";

export interface RegisterData {
  first_name?: string;
  last_name?: string;
  iin?: string;
  phone?: string;
  vehicle_info?: string;
}

export async function registerMessage(
  message: any,
  botToken: string,
  towTrack: Fetcher,
  session: { step: number; data: RegisterData }
) {
  const chatId = message.chat.id;
  const text = message.text?.trim();

  switch (session.step) {
    case 1:
      // Пользователь ответил на первый вопрос: имя
      updateSession(chatId, { first_name: text });
      nextStep(chatId);
      await sendMessage(botToken, chatId, 'Ваша фамилия?');
      break;

    case 2:
      updateSession(chatId, { last_name: text });
      nextStep(chatId);
      await sendMessage(botToken, chatId, 'Ваш ИИН?');
      break;

    case 3:
      updateSession(chatId, { iin: text });
      nextStep(chatId);
      await sendMessage(botToken, chatId, 'Номер телефона?');
      break;

    case 4:
      updateSession(chatId, { phone: text });
      nextStep(chatId);
      await sendMessage(botToken, chatId, 'Описание транспорта (модель, год, тоннаж):');
      break;

    case 5:
      updateSession(chatId, { vehicle_info: text });

      // Готовим финальную полезную нагрузку
      const final = getSession<RegisterData>(chatId);
      if (final) {
        const payload = {
          ...final.data,
          telegram_id: chatId
        };

        try {
          const response = await towTrack.fetch(
            "http://127.0.0.1:8787/api/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            }
          );

          if (response.ok) {
            await sendMessage(botToken, chatId, '✅ Регистрация прошла успешно!');
          } else {
            await sendMessage(botToken, chatId, '⚠️ Ошибка при регистрации, попробуйте позже.');
          }
        } catch (err) {
          console.error('Ошибка регистрации:', err);
          await sendMessage(botToken, chatId, '⚠️ Сервис недоступен, попробуйте позже.');
        }

        endSession(chatId);
      }
      break;

    default:
      // На всякий случай — сброс
      await sendMessage(botToken, chatId, 'Что-то пошло не так, начните регистрацию заново.');
      endSession(chatId);
      break;
  }
}