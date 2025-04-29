export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export type GetOfferDto = {
    id: number;
    created_at: string;
    partner_id: number;
    price: number;
    status: OfferStatus;
    order_id: number;
}

export type CreateOfferDto = {
    order_id: number;
    partner_id: number;
    price: number;
    status: OfferStatus;
};

export type UpdateOfferDto = Partial<CreateOfferDto>;