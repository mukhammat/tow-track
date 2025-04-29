export type RegisterDto = {
      first_name: string,
      last_name: string,
      iin: string,
      phone: string,
      telegram_id: number,
      vehicle_info: string,
}

import { z } from 'zod';

export const RegisterDtoSchema = z.object({
      first_name: z.string().min(1, 'first_name обязателен'),
      last_name: z.string().min(1, 'last_name обязателен'),
      iin: z.string().min(10, 'iin обязателен'),
      phone:  z.string().min(10, 'phone обязателен'),
      telegram_id: z.number(),
      vehicle_info: z.string().min(1, "vehicle_info обязателен")
      .max(255, 'vehicle_info не может быть больше 255 символов')
}).strict();