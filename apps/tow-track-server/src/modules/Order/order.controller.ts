import { Hono, Context } from "hono"
import { zValidator } from '@hono/zod-validator'
import { IOrderService, CreateOrderDtoSchema, CreateOrderDto } from ".";
import { ICustomResponse } from "@utils";

export interface IOrderController {
    readonly router: Hono;
}

export class OrderController implements IOrderController {
    public readonly router;
    constructor(
        private orderService: IOrderService, 
        private customResponse: ICustomResponse 
    ) {
        this.router = new Hono();
        this.routers();
    }

    private routers() {
        this.router.post("/create", zValidator("json", CreateOrderDtoSchema), this.createOrder.bind(this));
        this.router.get("/all", this.getAll.bind(this));
        this.router.post("/cancel", this.cancelOrder.bind(this));
        this.router.post("/complete", this.completeOrder.bind(this));
    }

    private async createOrder(c: Context) {
        const data = await c.req.json() as unknown as CreateOrderDto;
        const orderId = await this.orderService.createOrder(c.env.DB, data );
        return c.json(...this.customResponse.success({ message: "Order is created", status: 201, data: { orderId } }));
    }

    private async getAll(c: Context) {
        const data = await this.orderService.getAll(c.env.DB);
        console.log("All Data", data);
        return c.json(...this.customResponse.success({ data }));
    }

    private async cancelOrder(c: Context) {
        const { orderId } = c.req.param();

        if(isNaN(Number(orderId))) {
            return c.json({"message": "chatId is unvalid!" }, 401);
        }

        const result = await this.orderService.cancelOrder(c.env.DB, Number(orderId));
        return c.json(...this.customResponse.success({ message: "Order is canceled", status: 201, data: { result } }));
    }

    private async completeOrder(c: Context) {
        const { orderId } = c.req.param();

        if(isNaN(Number(orderId))) {
            return c.json({"message": "chatId is unvalid!" }, 401);
        }

        const result = await this.orderService.completeOrder(c.env.DB, Number(orderId));
        return c.json(...this.customResponse.success({ message: "Order is completed", status: 201, data: { result } }));
    }
}