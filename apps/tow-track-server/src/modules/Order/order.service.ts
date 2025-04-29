import { eq } from "drizzle-orm";
import { drizzleClient, orders, partners } from "@db"
import { CreateOrderDto, OrderStatus } from "."
import { DrizzleD1Database } from "drizzle-orm/d1";

export interface IOrderService {
    createOrder(client: D1Database, data: CreateOrderDto): Promise<boolean>;
    getAll(d1: D1Database): Promise<unknown>;
    update(d1: D1Database, order_id: number, data: unknown): Promise<boolean>
    setPartner(d1: D1Database, order_id: number, partner_id: number):Promise<unknown>;
}

export class OrderService implements IOrderService {
    constructor() {}

    async createOrder(d1: D1Database, data: CreateOrderDto) {
        console.log("Creating order in the database...");
        console.log(data);
        const db = drizzleClient(d1);
        const order = await db.insert(orders).values(data);
        console.log(order.success);
        return order.success;
    }

    async getAll(d1: D1Database) {
        console.log("Get all orders...");

        const db = drizzleClient(d1);
        const order = await db.query.orders.findMany({
            where: eq(orders.status, "searching"),
        });

        return order;
    }

    async update(d1: D1Database, order_id: number, data: unknown) {
        console.log("Update order...");

        const db = drizzleClient(d1);
        const order = await db
        .update(orders)
        .set(data)
        .where(eq(orders.id,  order_id));

        return order.success;
    }

    private async findOrderById(db: DrizzleD1Database<typeof import("@db")>, order_id: number) {
        const order = await db.query.orders.findFirst({
            where: eq(orders.id, order_id),
        });
    
        if (!order) {
            throw new Error("Заказ не найден");
        }
    
        return order;
    }
    
    private async findManyByPartnerId(db: DrizzleD1Database<typeof import("@db")>, partner_id: number) {
        return db.query.orders.findMany({
            where: eq(orders.partner_id, partner_id),
        });
    }
    
    async setPartner(d1: D1Database, order_id: number, partner_id: number) {
        const db = drizzleClient(d1);
        const order = await this.findOrderById(db, order_id);
    
        if (!["negotiating", "searching"].includes(order.status)) {
            throw new Error("Заказ недоступен!");
        }
    
        const partnerOrders = await this.findManyByPartnerId(db, partner_id);
    
        const busyOrder = partnerOrders.find(
            (o) => o.status === "waiting" || o.status === "loading"
        );
    
        if (busyOrder) {
            throw new Error(`У партнера уже есть активный заказ со статусом ${busyOrder.status}`);
        }
    
        const updatedOrder = await this.update(d1, order_id, { partner_id, status: "negotiating" });
    
        return updatedOrder;
    }
}