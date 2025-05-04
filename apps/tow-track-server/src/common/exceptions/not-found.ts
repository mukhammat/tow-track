import { HTTPException } from "hono/http-exception"

export class NotFoundException extends HTTPException {
    constructor(entity:  string) {
        const message = `${entity} not found!`;
        super(404, {
            "message": message
        });
        this.name = "NotFoundException";
    }
}