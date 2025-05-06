import { eq } from "drizzle-orm";
import { drizzleClient, orders, partners } from "@db"
import { CreateOrderDto, GetOrderDto, OrderStatus } from "."
import { NotFoundException, NotAvailableException } from "@exceptions";

export interface IOrderService {
    createOrder(client: D1Database, data: CreateOrderDto): Promise<number>;
    getAll(d1: D1Database): Promise<unknown>;
}

export class OrderService implements IOrderService {
    constructor() {
    }

    public async createOrder(d1: D1Database, data: CreateOrderDto) {
        console.log("Creating order in the database...");
        const db = drizzleClient(d1);
        return (await db.insert(orders).values(data).returning().get()).id;
    }

    async assignPartnerToOrder(d1: D1Database, order_id: number, partner_id: number) {
        console.log("Assign partner to order...");
        const db = drizzleClient(d1);
        const order = await this.getById(db, order_id);
    
        if (!["negotiating", "searching"].includes(order.status)) {
            throw new NotAvailableException({entity: "Order", id: order.id});
        }
    
        const partnerOrders = await this.getManyByPartnerId(db, partner_id);
    
        const busyOrder = partnerOrders.find(
            (o) => o.status === "waiting" || o.status === "loading"
        );
    
        if (busyOrder) {
            throw new NotAvailableException({ message: `Partner with id ${partner_id} already has active order` });
        }
    
        const updatedOrder = await this.update(db, order_id, { partner_id, status: "negotiating" });
    
        return updatedOrder;
    }

    public async getAll(d1: D1Database) {
        console.log("Get all orders...");
        const db = drizzleClient(d1);
        const order = await db.query.orders.findMany({
            where: eq(orders.status, "searching"),
        });

        if (!order.length) {
            throw new NotFoundException("Order");
        }

        return order;
    }

    private async getById(db: ReturnType<typeof drizzleClient>, order_id: number) {
        const order = await db.query.orders.findFirst({
            where: eq(orders.id, order_id),
        });
    
        if (!order) {
            throw new NotFoundException("Order");
        }
    
        return order;
    }
    
    private async getManyByPartnerId(db: ReturnType<typeof drizzleClient>, partner_id: number) {
        const results = await db.query.orders.findMany({
            where: eq(orders.partner_id, partner_id),
        });

        if (!results.length) {
            throw new NotFoundException("Order");
        }

        return results;
    }

    private async update(db:  ReturnType<typeof drizzleClient>, order_id: number, data: unknown) {
        console.log("Update order...");

        const order = await db
        .update(orders)
        .set(data)
        .where(eq(orders.id,  order_id)).returning().get();

        return order;
    }
}