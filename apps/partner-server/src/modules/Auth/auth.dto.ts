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
      first_name: z.string().min(1, 'first_name is required'),
      last_name: z.string().min(1, 'last_name is required'),
      iin: z.string().min(10, 'iin is required'),
      phone:  z.string().min(10, 'phone is required'),
      telegram_id: z.number(),
      vehicle_info: z.string().min(1, "vehicle_info is required")
      .max(255, 'vehicle_info can\'t be more then 255 chars ')
}).strict();