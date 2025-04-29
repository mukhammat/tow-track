import { sendMessage, sendKeyboard, sendReplyKeyboard } from "@utils";
import { getSession, updateSession, nextStep, endSession } from "@sessions";

export interface OrderData {
    from?: string;
    to?: string;
    vehicle_info?: string;
    intercity?: boolean;
    location_url?: string;
    phone?: string;
}
  

export async function order(message: any, botToken: string, towTrack: Fetcher, session: any) {
  const chatId = message.chat.id;
  const text = message.text;

  switch (session.step) {
      case 1:
        break;

      case 2:
        updateSession(chatId, { from: text });
        nextStep(chatId);
        await sendMessage(botToken, chatId, 'Куда доставить?');
        break;
  
      case 3:
        updateSession(chatId, { to: text });
        nextStep(chatId);
        await sendMessage(botToken, chatId, 'Состояние машины (например: заводится / не заводится)?');
        break;
  
      case 4:
        updateSession(chatId, { vehicle_info: text });
        nextStep(chatId);
        await sendReplyKeyboard(botToken, chatId, '📍 Отправьте свою локацию:', [
          [{ text: "📍 Отправить моё местоположение", request_location: true }]
        ]);
        break;

      case 5:
        if (message.location) {
          const { latitude, longitude } = message.location;
          const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          updateSession(chatId, { location_url: locationUrl });
          nextStep(chatId);
          await sendMessage(botToken, chatId, '📞 Напишите свой номер телефона для обратной связи.');
        } else if (text) {
          updateSession(chatId, { location_url: text });
          nextStep(chatId);
          await sendMessage(botToken, chatId, '📞 Напишите свой номер телефона для обратной связи.');
        } else {
          await sendMessage(botToken, chatId, 'Пожалуйста, отправьте свою локацию или напишите адрес.');
        }
        break;
        
      case 6: 
        updateSession(chatId, { phone: text });

        const finalSession = getSession<OrderData>(chatId);
  
        if (finalSession) {
          const payload = {
            from: finalSession.data.from!,
            to: finalSession.data.to!,
            intercity: finalSession.data.intercity!,
            phone: finalSession.data.phone!,
            client_telegram_id: chatId,
            vehicle_info: finalSession.data.vehicle_info!,
            location_url: finalSession.data.location_url
          };
          console.log(typeof chatId);
  
          try {
            console.log('Отправка данных на сервер:', payload);
            const response = await towTrack.fetch("http://127.0.0.1:8787/api/orders/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            console.log(response);
  
            if (response.ok) {
              await sendMessage(botToken, chatId, '✅ Заявка успешно отправлена! В течение 5 минут с вами свяжутся.');
            } else {
              await sendMessage(botToken, chatId, '⚠️ Ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
            }
          } catch (error) {
            console.error('Ошибка отправки на сервер:', error);
            await sendMessage(botToken, chatId, '⚠️ Не удалось отправить заявку. Ошибка сервера.');
          }
  
          endSession(chatId);
        }
  
        break;
  
      default:
        await sendMessage(botToken, chatId, 'Что-то пошло не так. Пожалуйста, начните заново.');
        endSession(chatId);
    }
}

