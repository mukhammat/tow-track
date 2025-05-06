export type OrderStatus = 'searching' | 'negotiating' | 'waiting' | 'loading' | 'delivered' | 'canceled'

export type CreateOrderDto = {
  from: string;
  to: string;
  intercity?: 0 | 1;
  location_url?: string;
  phone: string;
  client_telegram_id: number;
  vehicle_info: string;
};

export type GetOrderDto =  {
  id: number;
  phone: string;
  vehicle_info: string;
  created_at: string;
  from: string;
  to: string;
  intercity: number;
  location_url: string;
  client_telegram_id: number;
  partner_id: number;
  price: number;
  status: OrderStatus;
  updated_at: string;
}


import { z } from 'zod';

const OrderStatusEnum = z.enum([
  'searching', // Посик эвакуатора
  'negotiating', // Переговоры с водителем
  'waiting', // Ожидание водителя
  'loading', // Загрузка автомобиля
  'delivered', // Автомобиль эвакуирован
  'canceled', // Заказ отменён
]);

export const CreateOrderDtoSchema = z.object({
  from:          z.string().min(1, 'откуда обязателен'),
  to:            z.string().min(1, 'куда обязателен'),
  intercity:     z.boolean().default(false)
    .transform((val) => (val ? 1 : 0)),  // превратим boolean → 0|1 для БД
  location_url:  z.string().url().optional(),
  phone:         z.string().min(5, 'некорректный телефон'),
  client_telegram_id: z.number(),
  vehicle_info:  z.string().min(3, 'укажи информацию о транспорте'),
  partner_id:    z.number().int().nullable().optional(),
  price:         z.number().nonnegative().nullable().optional(),
  status:        OrderStatusEnum.optional().default('searching'), // по умолчанию - searching
}).strict();