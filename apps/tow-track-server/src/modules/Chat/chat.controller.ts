import { Hono, Context } from "hono";
import { ChatService } from ".";
import { CustomResponse } from "@utils";

export class ChatController {
    public readonly router: Hono;

    constructor(
        private chatService: ChatService,
        private customResponse: CustomResponse
    ) {
        this.router = new Hono();
        this.routers();
    }

    private routers() {
        this.router.post("/send", this.sendMessage.bind(this));
        this.router.get("/all/:chatId", this.getMessages.bind(this));
    }

    private async sendMessage(c: Context) {
        const { chatId, message, isClient } = await c.req.json();
            
        if(isNaN(Number(chatId))) {
            return c.json({"message": "chatId is unvalid!" }, 401);
        }

        const result = await this.chatService.sendMessage(c.env.DB, {chat_id: chatId, message, is_client: isClient });

        return c.json(...this.customResponse.success({data: {
            result,
            messages: "Message sent!",
            status: 201
        }}))
    }

    private async getMessages(c: Context) {
        const { chatId } = c.req.param();

        if(isNaN(Number(chatId))) {
            return c.json({"message": "chatId is unvalid!" }, 401);
        }

        const result = await this.chatService.getMessages(c.env.DB, Number(chatId));

        return c.json(...this.customResponse.success({data: {
            result,
            messages: "Messages received!",
            status: 201
        }}))
    }
}