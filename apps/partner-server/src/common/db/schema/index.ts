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