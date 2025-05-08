export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export type GetOfferDto = {
    id: number;
    created_at: string;
    partner_id: number;
    price: number;
    status: OfferStatus;
    order_id: number;
}

export type CreateOfferDto = Omit<GetOfferDto, "id" | "created_at">

export type UpdateOfferDto = Partial<CreateOfferDto>;

import { z } from 'zod';

export const CreateOfferDtoSchema = z.object({
    order_id:   z.number().int().nullable().optional(),
    partner_id: z.number().int().nullable().optional(),
    price:      z.number().nonnegative().nullable().optional(),
});