import { drizzleClient, offers } from "@db"
import { eq } from "drizzle-orm";
import { CreateOfferDto, GetOfferDto, OfferStatus } from "."
import { BadRequestException, NotFoundException } from "@exceptions";
import { eventBus } from "@libs";
import { DrizzleD1Database } from "drizzle-orm/d1";

export interface IOfferService {
    create(d1: D1Database, data: CreateOfferDto):Promise<void>;
    getAll(d1: D1Database): Promise<GetOfferDto[]>;
    acceptOffer( d1: D1Database,
      offerId: number): Promise<GetOfferDto>;
}

export class OfferService implements IOfferService {
    constructor() {}

    public async create(d1: D1Database, data: CreateOfferDto) {
        const db = drizzleClient(d1);
        await db.insert(offers).values(data).returning().get();
        return;
    }

    public async getAll(d1: D1Database) {
        const db = drizzleClient(d1);
        const allOffers = await db.query.offers.findMany({
            where: eq(offers.status, "pending"),
        });

        if(!allOffers) {
            throw new NotFoundException("Offer")
        }

        return allOffers;
    }

    public async acceptOffer( d1: D1Database,
      offerId: number) {
        const offer = await this.updateOfferStatus(d1, offerId, "accepted");

        eventBus.emit("offer.accepted", {
          offerId,
          orderId: offer.order_id,
          partnerId: offer.partner_id,
          db: d1
        });
        return offer;
    }

    private async updateOfferStatus(
      d1: D1Database,
      offerId: number,
      status: Omit<OfferStatus, "pending">,
    ): Promise<GetOfferDto> {
      const db = drizzleClient(d1);
  
      const offer = await db.query.offers.findFirst({
        where: eq(offers.id, offerId),
      });

      if (!offer) {
        throw new NotFoundException("Offer");
      }
  
      // 2. Проверить, что его ещё можно менять
      if (["accepted", "rejected"].includes(offer.status)) {
        throw new BadRequestException({
          message: `Offer #${offerId} has already been ${offer.status}.`,
        });
      }

      const data: unknown = {
          status
      };
  
      const update = await db
        .update(offers)
        .set(data)
        .where(eq(offers.id, offerId)).returning().get();


      return update;
  }
}