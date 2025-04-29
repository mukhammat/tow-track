/**
 * Отправляет текстовое сообщение пользователю
 */
export async function sendMessage(
  botToken: string, 
  chatId: number | string, 
  text: string, 
  options: Record<string, any> = {}
) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...options,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error sending message:', errorData);
    throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Отправляет сообщение с инлайн клавиатурой
 */
export async function sendKeyboard(
  botToken: string, 
  chatId: number | string, 
  text: string, 
  keyboard: Array<Array<{ text: string, callback_data: string }>>
) {
  return sendMessage(botToken, chatId, text, {
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
}

export async function sendReplyKeyboard(
  botToken: string,
  chatId: number | string,
  text: string,
  keyboard: Array<Array<{ text: string, request_location?: boolean }>>
) {
  return sendMessage(botToken, chatId, text, {
    reply_markup: {
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
}


/**
 * Отправляет ответ на callback_query
 */
export async function answerCallbackQuery(
  botToken: string, 
  callbackQueryId: string, 
  text?: string, 
  showAlert?: boolean
) {
  const url = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert,
    }),
  });
  
  return response.json();
}

/**
 * Отправляет фото пользователю
 */
export async function sendPhoto(
  botToken: string, 
  chatId: number | string, 
  photoUrl: string, 
  caption?: string, 
  options: Record<string, any> = {}
) {
  const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoUrl,
      caption,
      parse_mode: 'HTML',
      ...options,
    }),
  });
  
  return response.json();
}

/**
 * Редактирует текст сообщения
 */
export async function editMessageText(
  botToken: string, 
  chatId: number | string, 
  messageId: number, 
  text: string, 
  options: Record<string, any> = {}
) {
  const url = `https://api.telegram.org/bot${botToken}/editMessageText`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      ...options,
    }),
  });
  
  return response.json();
}

export async function deleteMessage(botToken: string, chatId: number, messageId: number) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/deleteMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId
      })
    });
  } catch (error) {
    console.error('Ошибка удаления сообщения:', error);
  }
}

interface TelegramResponse<T> {
  ok: boolean;
  result: T;
  description?: string;
}


export async function sendAndDeleteMessage(
  botToken: string,
  chatId: number,
  text: string,
  delayMs: number = 5000
) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const data: TelegramResponse<{ message_id: number }> = await response.json();

    if (!data.ok) {
      console.error('Ошибка при отправке сообщения:', data.description);
      return;
    }

    const sentMessageId = data.result.message_id;

    setTimeout(async () => {
      try {
        await deleteMessage(botToken, chatId, sentMessageId);
      } catch (err) {
        console.error('Ошибка при удалении сообщения:', err);
      }
    }, delayMs);

  } catch (error) {
    console.error('Ошибка отправки сообщения:', error);
  }
}
