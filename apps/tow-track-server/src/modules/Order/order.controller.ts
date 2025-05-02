import { Hono, Context } from "hono"
import { zValidator } from '@hono/zod-validator'
import { IOrderService, CreateOrderDtoSchema, CreateOrderDto } from ".";
import { checkAuth } from "@middleware";


export interface IOrderController {
    readonly router: Hono;
}


export class OrderController implements IOrderController {
    public readonly router;
    constructor(private orderService: IOrderService) {
        this.router = new Hono();
        this.routers();
    }

    private routers() {
        this.router.post("/create", zValidator("json", CreateOrderDtoSchema), this.createOrder.bind(this));
        this.router.get("/all", this.getAll.bind(this));
        this.router.get("/assign-partner/:orderId", checkAuth, this.assignPartnerToOrder.bind(this))
    }

    private async createOrder(c: Context) {
        const data = await c.req.json() as unknown as CreateOrderDto;
        const isCreated = await this.orderService.create(c.env.DB, data );
        return c.json({ success: isCreated });
    }

    private async getAll(c: Context) {
        const data = await this.orderService.getAll(c.env.DB);
        console.log("All Data", data)
        return c.json({ success: true , data });
    }

    private async assignPartnerToOrder(c: Context) {
        const { orderId } = c.req.param();
        if (!orderId || isNaN(Number(orderId))) {
            return c.json({ success: false, message: "Invalid order ID" }, 400);
        }
        const partner = await c.get("partner");
        const isUpdated = await this.orderService.assignPartnerToOrder(c.env.DB, Number(orderId),partner.id);
        return c.json({ success: isUpdated });
    }
}