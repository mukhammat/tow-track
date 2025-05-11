// src/controllers/auth.controller.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { IAuthService, RegisterDto, RegisterDtoSchema } from '.'
import { IHttpResponse } from '@utils'
import { z } from 'zod'

interface LoginBody {
  telegram_id: number
}

export class AuthController {
  public constructor(
    private fastify: FastifyInstance,
    private authService: IAuthService,
    private httpResponse: IHttpResponse
  ) {
    this.router();
  }

  private router() {
    this.fastify.post<{ Body: LoginBody }>('/auth/login', {
        schema: {
            body: z.object({ telegram_id: z.number() }).strict(),
        }
    }, this.login.bind(this));
  
    this.fastify.post<{
        Body: RegisterDto
    }>('/auth/register', {
        schema: {
            body: RegisterDtoSchema,
        }
    }, this.register.bind(this));
  }

  private async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ) {
    const { telegram_id } = request.body
    const auth = await this.authService.login(telegram_id)
    if (!auth) {
      return reply
        .status(404)
        .send({ success: false, message: 'User not found' })
    }

    const [payload, status] = this.httpResponse.success({
        data: {
            telegram_id
        }
    })
    return reply.status(status).send(payload)
  }

  private async register(
    request: FastifyRequest<{ Body: RegisterDto }>,
    reply: FastifyReply
  ) {
    const data = request.body
    const result = await this.authService.register(data)
    if (!result) {
      return reply
        .status(409)
        .send({ success: false, message: 'User already exists' })
    }

    const  [payload, status] = this.httpResponse.success({
        status: 201,
        data: result
    })
    return reply.status(status).send(payload)
  }
}
