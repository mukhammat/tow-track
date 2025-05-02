import { HTTPException } from "hono/http-exception"

interface NotAvailableOpts {
    entity?: string;
    id?: number | string;
    message?: string;
}

export class NotAvailableException extends HTTPException {
    constructor({ entity, id, message }: NotAvailableOpts = {}) {
        const text = message
          ?? (entity && id != null ? `${entity} с ID ${id} недоступен.` : "Недоступен.");
        super(404, {
            message: text,
        });
        this.name = "NotAvailableException";
    }
}
