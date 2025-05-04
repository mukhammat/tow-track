import { eq } from "drizzle-orm"
import { drizzleClient, partners } from "@db"
import {  createMiddleware } from "hono/factory"

export const checkAuth = createMiddleware( async (c, next) => {
    const tgId = c.req.header('x-telegram-id')
  
    if (!tgId) {
        return c.json({"message": "Unauthorized"}, 401);
    }

    const telegramId = Number(tgId)
    if (isNaN(telegramId)) {
      return c.json({ message: 'Invalid ID' }, 400)
    }
    
  
    const db = drizzleClient(c.env.DB);
    const partner = await db.query.partners.findFirst({
        where: eq(partners.telegram_id, Number(telegramId))
    });
  
    if (!partner) {
      return c.json({"message": "Unauthorized"}, 401);
    }
  
    c.set('partner', partner)
    await next()
});