type GetMesssageType = {
    id: number;
    chat_id: number;
    message: string;
    is_client: number;
    sent_at: string;
}

type CreateMessageDto = Omit<GetMesssageType, "id" | "sent_at">;

type UpdateMessageDto = Partial<CreateMessageDto>;