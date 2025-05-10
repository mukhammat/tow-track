import { eq } from "drizzle-orm";
import { drizzleClient, orders } from "@db"
import { NotFoundException, NotAvailableException } from "@exceptions";
import { CreateOrderDto, GetOrderDto } from "."

export interface IOrderService {
    createOrder(client: D1Database, data: CreateOrderDto): Promise<number>;
    getAll(d1: D1Database): Promise<unknown>;
    cancelOrder(d1: D1Database, order_id: number): Promise<number>;
    completeOrder(d1: D1Database, order_id: number): Promise<number>;
    getById(d1: D1Database, order_id: number): Promise<GetOrderDto>;
}

const {
    ORDER,
    SEARCH,
    NEGOTIAT,
    WAIT,
    LOAD,
    DELIVER,
    CANCEL
} = {
    ORDER: "Order",
    SEARCH: "searching",
    NEGOTIAT: "negotiating",
    WAIT: "waiting",
    LOAD: "loading",
    DELIVER: "delivered",
    CANCEL: "canceled",
};

export class OrderService implements IOrderService {
    constructor() {
    }

    public async createOrder(d1: D1Database, data: CreateOrderDto) {
        console.log("Creating order in the database...");
        const db = drizzleClient(d1);
        return (await db.insert(orders).values(data).returning().get()).id;
    }

    public async assignPartnerToOrder(d1: D1Database, order_id: number, partner_id: number) {
        console.log("Assign partner to order...");
        const order = await this.getById(d1, order_id);
    
        if (![NEGOTIAT, SEARCH].includes(order.status)) {
            throw new NotAvailableException({entity: ORDER, id: order.id});
        }
    
        const partnerOrders = await this.getManyByPartnerId(d1, partner_id);
    
        const busyOrder = partnerOrders.find(
            (o) => o.status === WAIT || o.status === LOAD
        );
    
        if (busyOrder) {
            throw new NotAvailableException({ message: `Partner with id ${partner_id} already has active order` });
        }
    
        const updatedOrder = await this.updateOrder(d1, order_id, { partner_id, status: NEGOTIAT });
    
        return updatedOrder;
    }

    public async getAll(d1: D1Database) {
        console.log("Get all orders...");
        const db = drizzleClient(d1);
        const order = await db.query.orders.findMany({
            where: eq(orders.status, "searching"),
        });

        if (!order.length) {
            throw new NotFoundException(ORDER);
        }

        return order;
    }

    public async getById(d1: D1Database, order_id: number) {
        const db = drizzleClient(d1);

        const order = await db.query.orders.findFirst({
            where: eq(orders.id, order_id),
        });
    
        if (!order) {
            throw new NotFoundException(ORDER);
        }
    
        return order;
    }
    
    private async getManyByPartnerId(d1: D1Database, partner_id: number) {
        const db = drizzleClient(d1);
        const results = await db.query.orders.findMany({
            where: eq(orders.partner_id, partner_id),
        });

        if (!results.length) {
            throw new NotFoundException(ORDER);
        }

        return results;
    }

    private async updateOrder(d1: D1Database, order_id: number, data: unknown) {
        console.log("Update order...");
        const db = drizzleClient(d1);
        const order = await db
        .update(orders)
        .set(data)
        .where(eq(orders.id,  order_id)).returning().get();

        return order;
    }

    public async cancelOrder(d1: D1Database, order_id: number) {
        console.log("Cancel order...");
        const order = await this.getById(d1, order_id);
    
        if (order.status === CANCEL) {
            throw new NotAvailableException({entity: ORDER, id: order.id});
        }

        if([DELIVER, WAIT, LOAD, CANCEL].includes(order.status)) {
            throw new NotAvailableException({entity: ORDER, id: order.id});
        }
    
        const updatedOrder = await this.updateOrder(d1, order_id, { status: CANCEL });
    
        return updatedOrder.id;
    }

    public async completeOrder(d1: D1Database, order_id: number) {
        console.log("Complete order...");
        const order = await this.getById(d1, order_id);
    
        if (order.status === DELIVER) {
            throw new NotAvailableException({entity: ORDER, id: order.id});
        }

            
        if ([SEARCH, NEGOTIAT, CANCEL, DELIVER].includes(order.status)) {
            throw new NotAvailableException({entity: ORDER, id: order.id});
        }
    
        const updatedOrder = await this.updateOrder(d1, order_id, { status: DELIVER });
    
        return updatedOrder.id;
    }
}