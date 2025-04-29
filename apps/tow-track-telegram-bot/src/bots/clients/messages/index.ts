import { sendMessage } from "@utils";
import { getSession } from "@sessions";
import { order } from "./order"

export default async function(message: any, botToken: string, towTrack: Fetcher) {
  const chatId = message.chat.id;

  const session = getSession(chatId);

  if (!session) {
    await sendMessage(botToken, chatId, 'Пожалуйста, нажмите "Заказать эвакуатор" чтобы начать заявку.');
    return;
  } else {
    await order(message, botToken, towTrack, session);
  }
}
