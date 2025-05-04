import { drizzleClient, offers } from "@db"
import { eq } from "drizzle-orm";
import { CreateOfferDto, GetOfferDto, OfferStatus } from "."
import { BadRequestException, NotFoundException } from "@exceptions";
import { eventBus } from "@libs";

export interface IOfferService {
  createOffer(d1: D1Database, data: CreateOfferDto):Promise<void>;
  getAll(d1: D1Database): Promise<GetOfferDto[]>;
  acceptOffer( d1: D1Database, offerId: number): Promise<GetOfferDto>;
  getPendingOffersByOrderId(d1: D1Database, orderId: number): Promise<GetOfferDto[]>;
}

export class OfferService implements IOfferService {
  constructor() {}

  public async createOffer(d1: D1Database, data: CreateOfferDto) {
      const db = drizzleClient(d1);
      await db.insert(offers).values(data).returning().get();
      return;
  }

  public async getAll(d1: D1Database) {
      const db = drizzleClient(d1);
      const allOffers = await db.query.offers.findMany({
          where: eq(offers.status, "pending"),
      });

      if(!allOffers.length) {
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

  public async getPendingOffersByOrderId(d1: D1Database, orderId: number) {
      const db = drizzleClient(d1);
      const offersByOrderId = await db.query.offers.findMany({
          where: eq(offers.order_id, orderId) && eq(offers.status, "pending"),
      });

      if(!offersByOrderId.length) {
          throw new NotFoundException("Offer")
      }

      return offersByOrderId;
  }
}