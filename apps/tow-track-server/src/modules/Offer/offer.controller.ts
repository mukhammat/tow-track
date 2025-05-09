import { Context, Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { CreateOfferDtoSchema, IOfferService } from ".";
import { ICustomResponse } from "@utils";
import { IdSchema } from "@dto";

export interface IOfferController {
    router: Hono;
}

export class OfferController {
    public readonly router: Hono;
    constructor(
        private offerService: IOfferService,
        private customResponse: ICustomResponse
    ) {
        this.router = new Hono();
        this.routers();
    }

    private routers() {
        this.router.patch("/accept/:offerId", zValidator("param", IdSchema), this.acceptOfferThenOrder.bind(this));
        this.router.post("/create", zValidator("json", CreateOfferDtoSchema), this.createOffer.bind(this));
        this.router.get("/all/:orderId", zValidator("param", IdSchema),  this.getOffersByOrderId.bind(this));
        this.router.patch("/cancel/:offerId", zValidator("param", IdSchema), this.cancelOffer.bind(this));
    }

    private async acceptOfferThenOrder(c: Context) {
        const { offerId } = c.req.param();

        if(isNaN(Number(offerId))) {
            return c.json({"message": "offerId is unvalid!" }, 401);
        }

        const data = await this.offerService.acceptOffer(c.env.DB, Number(offerId));

        console.log("Datas:", data);

        return c.json(...this.customResponse.success({ message: "Offer then order accepted!" }));
    } 

    private async createOffer(c: Context) {
        const data = await c.req.json();

        const offerId = await this.offerService.createOffer(c.env.DB, data);

        return c.json(...this.customResponse.success({ message: "Offer created!", status: 201, data: { offerId } }));
    }

    private async getOffersByOrderId(c: Context) {
        const { orderId } = c.req.param();

        const offers = await this.offerService.getPendingOffersByOrderId(c.env.DB, Number(orderId));

        return c.json(...this.customResponse.success({ data: { offers } }));
    }

    private async cancelOffer(c: Context) {
        const { offerId } = c.req.param();

        const offer = await this.offerService.cancelOffer(c.env.DB, Number(offerId));

        return c.json(...this.customResponse.success({data: { offerId: offer.id }}));
    }
}