import { Context, Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { CreateOfferDtoSchema, IOfferService } from ".";
import { d } from "drizzle-kit/index-BAUrj6Ib";

export interface IOfferController {
    router: Hono;
}

export class OfferController {
    public readonly router: Hono;
    constructor(private offerService: IOfferService) {
        this.router = new Hono();
        this.routers();
    }

    private routers() {
        this.router.get("/accept/:offerId", this.acceptOfferThenOrder.bind(this));
        this.router.post("/create", zValidator("json", CreateOfferDtoSchema), this.createOffer.bind(this));
        this.router.get("/all/:orderId", this.getOffersByOrderId.bind(this));
    }

    async acceptOfferThenOrder(c: Context) {
        const { offerId } = c.req.param();

        if(isNaN(Number(offerId))) {
            return c.json({"message": "offerId is unvalid!" }, 401);
        }

        const data = await this.offerService.acceptOffer(c.env.DB, Number(offerId));

        console.log("Datas:", data);

        return c.json({"message": "Offer then order accepted!" }, 200);
    }

    async createOffer(c: Context) {
        const data = await c.req.json();

        await this.offerService.createOffer(c.env.DB, data);

        return c.json({ "message": "Offer is created" }, 201);
    }

    async getOffersByOrderId(c: Context) {
        const { orderId } = c.req.param();

        if(isNaN(Number(orderId))) {
            return c.json({"message": "orderId is unvalid!" }, 401);
        }
        const results = await this.offerService.getPendingOffersByOrderId(c.env.DB, Number(orderId));

        return c.json({"data": results}, 200);
    }
}