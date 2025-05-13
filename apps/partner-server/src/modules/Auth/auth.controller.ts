import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { IAuthService, RegisterDto, RegisterDtoSchema } from '.'
import { httpResponse } from '@utils'

interface LoginBody {
  telegram_id: number
}

export class AuthController {
  constructor(
    private fastify: FastifyInstance,
    private authService: IAuthService,
  ) {
    this.routers();
  }

  private routers() {
    this.fastify.post<{ Body: LoginBody }>('/login',{
    }, this.login.bind(this));
    this.fastify.post<{ Body: RegisterDto }>('/register', {
      schema: {
        body: RegisterDtoSchema
      }
    }, this.register.bind(this));
  };

  private async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ) {
    const { telegram_id } = request.body;
    const token = await this.authService.login(telegram_id);
    if (!token) {
      return reply
        .status(404)
        .send({ success: false, message: 'User not found' })
    }

    reply.setCookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    });

    return reply.status(200).send(httpResponse.success({data: { token }}));
  }

  private async register(
    request: FastifyRequest<{ Body: RegisterDto }>,
    reply: FastifyReply
  ) {
    const data = request.body
    const token = await this.authService.register(data)
    if (!token) {
      return reply
        .status(409)
        .send({ success: false, message: 'User already exists' })
    }

    reply.setCookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    })

    return reply.status(201).send(httpResponse.success({data: { token }}))
  }
}
