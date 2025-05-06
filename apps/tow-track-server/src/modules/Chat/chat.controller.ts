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
        this.router.post("/get", this.getMessages.bind(this));
        // this.router.post("/delete", this.deleteMessage.bind(this));
        // this.router.post("/update", this.updateMessage.bind(this));
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
        const { chatId } = await c.req.json();

        if(isNaN(Number(chatId))) {
            return c.json({"message": "chatId is unvalid!" }, 401);
        }

        const result = await this.chatService.getMessages(c.env.DB, chatId);

        return c.json(...this.customResponse.success({data: {
            result,
            messages: "Messages received!",
            status: 201
        }}))
    }

    // private async deleteMessage(c: Context) {
    //     const { messageId } = await c.req.json();

    //     if(isNaN(Number(messageId))) {
    //         return c.json({"message": "messageId is unvalid!" }, 401);
    //     }

    //     const result = await this.chatService.deleteMessage(c.env.DB, messageId);

    //     return c.json(...this.customResponse.success({data: {
    //         result,
    //         messages: "Message deleted!",
    //         status: 201
    //     }}))
    // }

    // private async updateMessage(c: Context) {
    //     const { messageId, message } = await c.req.json();

    //     if(isNaN(Number(messageId))) {
    //         return c.json({"message": "messageId is unvalid!" }, 401);
    //     }

    //     const result = await this.chatService.updateMessage(c.env.DB, messageId, message);

    //     return c.json(...this.customResponse.success({data: {
    //         result,
    //         messages: "Message updated!",
    //         status: 201
    //     }}));
    // }


}