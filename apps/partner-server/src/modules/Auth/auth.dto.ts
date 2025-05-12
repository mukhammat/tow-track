export type RegisterDto = {
      first_name: string,
      last_name: string,
      iin: string,
      phone: string,
      telegram_id: number,
      vehicle_info: string,
}

import { Type } from '@sinclair/typebox';

export const RegisterDtoSchema = Type.Object({
  first_name: Type.String({ minLength: 1 }),
  last_name: Type.String({ minLength: 1 }),
  iin: Type.String({ minLength: 10 }),
  phone: Type.String({ minLength: 10 }),
  telegram_id: Type.Number(),
  vehicle_info: Type.String({ minLength: 1, maxLength: 255 })
}, {
  additionalProperties: false
});