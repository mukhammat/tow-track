import { Context, Hono } from "hono";
import { IOfferService } from ".";

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
        this.router.post("/create", this.createOffer.bind(this));
    }

    async acceptOfferThenOrder(c: Context) {
        const {offerId} = c.req.param();

        const data = await this.offerService.acceptOffer(c.env.DB, Number(offerId));

        return c.json({"data": data }, 200);
    }

    async createOffer(c: Context) {
        const data = await c.req.json();

        await this.offerService.create(c.env.DB, data);

        return c.json({ "message": "Offer is created" }, 201);
    }
}