import { HTTPException } from "hono/http-exception";

interface BadRequestOpts {
  entity?: string;
  id?: number | string;
  message?: string;
}

export class BadRequestException extends HTTPException {
  constructor({ entity, id, message }: BadRequestOpts = {}) {
    // 1) Если задан custom message — используем его
    // 2) Если заданы entity и id — говорим об ошибке данных
    // 3) Иначе — общее сообщение о плохом запросе
    const text = message
      ?? (entity && id != null
        ? `Invalid request for ${entity} with ID ${id}.`
        : "Bad request.");

    super(400, { message: text });
    this.name = "BadRequestException";
  }
}
