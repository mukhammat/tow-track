import { drizzleClient, offers } from "@db"
import { eq } from "drizzle-orm";
import { CreateOfferDto, GetOfferDto, OfferStatus } from "."
import { BadRequestException, NotFoundException } from "@exceptions";
import { EventEmitter } from 'events';

export interface IOfferService {
    create(d1: D1Database, data: CreateOfferDto):Promise<void>;
    getAll(d1: D1Database): Promise<GetOfferDto[]>;
    updateOfferStatus(
        d1: D1Database,
        offerId: number,
        status: Omit<OfferService, "pending">,
      ): Promise<void>
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

    public async updateOfferStatus(
        d1: D1Database,
        offerId: number,
        status: Omit<OfferService, "pending">,
      ): Promise<void> {
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
    
        await db
          .update(offers)
          .set(data)
          .where(eq(offers.id, offerId));
    }

}