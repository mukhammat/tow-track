type CreateMessageDto = {
      chat_id: number,
      message: string,
      is_client: boolean,
}

type UpdateMessageDto = Partial<CreateMessageDto>;

type GetMesssageType = {
    id: number;
    chat_id: number;
    message: string;
    is_client: number;
    sent_at: string;
}