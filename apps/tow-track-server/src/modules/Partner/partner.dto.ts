export type GetPartnerDto = {
      id: number;
      first_name: string;
      last_name: string;
      iin: string;
      phone: string;
      telegram_id: number;
      vehicle_info: string;
      created_at: string;
}

export type CreatePartnerDto = Omit<GetPartnerDto, "id" | "created_at">


export type UpdatePartnerDto = Partial<CreatePartnerDto>;

import {z} from "zod";

export const PhoneSchema = z.number().int().positive('ID заказа должен быть положительным числом').min(8).max(20);