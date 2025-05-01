import { sqliteTable, text, integer, real, uniqueIndex } from 'drizzle-orm/sqlite-core';

// Партнёры
export const partners = sqliteTable('partners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  iin: text('iin').notNull().unique(),
  phone: text('phone').notNull().unique(),
  telegram_id: integer('telegram_id').notNull().unique(),
  vehicle_info: text('vehicle_info').notNull(),
  created_at: text('created_at').default('CURRENT_TIMESTAMP')
});

// Заказы
const OrderStatus = [
  'searching', // Посик эвакуатора
  'negotiating', // Переговоры с водителем
  'waiting', // Ожидание водителя
  'loading', // Загрузка автомобиля
  'delivered', // Автомобиль эвакуирован
  'canceled', // Заказ отменён
] as const;

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  from:   text('from').notNull(),
  to:     text('to').notNull(),
  intercity: integer('is_intercity').notNull().default(0),
  location_url: text('location_url'),
  phone: text('phone'),
  client_telegram_id: integer('client_telegram_id'),
  vehicle_info: text('vehicle_info').notNull(),
  partner_id: integer('partner_id').references(() => partners.id, { onDelete: 'cascade' }),
  price: real('price'),
  status: text('status').$type<typeof OrderStatus[number]>().notNull().default('searching'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
});

const OfferStatus = [
  'pending',   // Ожидание решения клиента
  'accepted',  // Клиент принял оффер
  'rejected'   // Клиент отказал
] as const;

export const offers = sqliteTable(
  'offers',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    partner_id: integer('partner_id').notNull().references(() => partners.id, { onDelete: 'cascade' }),
    price: real('price').notNull(),
    status: text('status').$type<typeof OfferStatus[number]>().notNull().default('pending'),
    created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  },
  (offers) => ({
    uniqueOrderPartner: uniqueIndex('unique_order_partner').on(offers.order_id, offers.partner_id),
  })
);


// Чаты
export const chats = sqliteTable(
  'chats',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    partner_id: integer('partner_id').notNull().references(() => partners.id, { onDelete: 'cascade' }),
    created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  },
  (chats) => ({
    // 👇 Добавляем уникальный индекс на пару (order_id, partner_id)
    uniqueChat: uniqueIndex('unique_order_partner_chat').on(chats.order_id, chats.partner_id),
  })
);

// Сообщения в чате
export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  chat_id: integer('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  sent_at: text('sent_at').default('CURRENT_TIMESTAMP')
});