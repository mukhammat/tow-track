import { z } from 'zod';

export const IdSchema = z.number().int().positive('ID заказа должен быть положительным числом');