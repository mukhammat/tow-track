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
        this.router.post("/create", this.createChat.bind(this))
    }

    private async createChat(c: Context) {
        const { offerId } = await c.req.json();

        if(isNaN(Number(offerId))) {
            return c.json({"message": "orderId is unvalid!" }, 401);
        }

        const chatId = await this.chatService.createChat(c.env.DB, offerId);

        return c.json(...this.customResponse.success({data: {
            chatId,
            messages: "Chat created!",
            status: 201
        }}))
    }

    private async sendMessage(c: Context) {
        
    }
}