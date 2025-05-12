import { pgTable, text, integer, real, uniqueIndex, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Партнёры
export const partners = pgTable('partners', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  iin: text('iin').notNull().unique(),
  phone: text('phone').notNull().unique(),
  telegram_id: integer('telegram_id').notNull().unique(),
  vehicle_info: text('vehicle_info').notNull(),
  created_at: timestamp('created_at', { mode: 'string', withTimezone: true })
  .defaultNow()
});

export const OrderStatusEnum = pgEnum('order_status', [
  'searching',
  'negotiating',
  'waiting',
  'loading',
  'delivered',
  'canceled',
]);

export const orders = pgTable('orders', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  from:   text('from').notNull(),
  to:     text('to').notNull(),
  intercity: boolean('is_intercity').notNull().default(false),
  location_url: text('location_url'),
  phone: text('phone'),
  client_telegram_id: integer('client_telegram_id'),
  vehicle_info: text('vehicle_info').notNull(),
  partner_id: integer('partner_id').references(() => partners.id, { onDelete: 'cascade' }),
  price: real('price'),
  status: OrderStatusEnum('status').notNull().default('searching'),
  created_at: timestamp('created_at', { mode: 'string', withTimezone: true })
  .defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string', withTimezone: true })
  .defaultNow(),
});

export const OfferStatusEnum = pgEnum("offer_status",[
  'pending',   // Ожидание решения клиента
  'accepted',  // Клиент принял оффер
  'rejected'   // Клиент отказал
]);

export const offers = pgTable(
  'offers',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    partner_id: integer('partner_id').notNull().references(() => partners.id, { onDelete: 'cascade' }),
    price: real('price').notNull(),
    status: OfferStatusEnum('status').notNull().default('pending'),
    created_at: timestamp('created_at', { mode: 'string', withTimezone: true })
    .defaultNow(),
  },
  (offers) => ({
    uniqueOrderPartner: uniqueIndex('unique_order_partner').on(offers.order_id, offers.partner_id),
  })
);


// Чаты
export const chats = pgTable(
  'chats',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    offer_id: integer('offer_id').notNull().unique().references(() => offers.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at', { mode: 'string', withTimezone: true })
    .defaultNow(),
  },
);

// Сообщения в чате
export const messages = pgTable('messages', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  chat_id: integer('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  is_client: boolean('is_client').notNull().default(false),
  sent_at: timestamp('sent_at', { mode: 'string' })
  .defaultNow(),
});