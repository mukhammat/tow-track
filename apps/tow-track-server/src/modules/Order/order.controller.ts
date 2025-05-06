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
}