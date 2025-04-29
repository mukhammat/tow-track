import { sendMessage } from "@utils";
import { getSession } from "@sessions";
import { registerMessage } from "./auth/auth.message"

export default async function(message: any, botToken: string, towTrack: Fetcher) {
  const chatId = message.chat.id;

  const session = getSession(chatId);

  if(session) {
    await registerMessage(message, botToken, towTrack, session);
  }
}
