import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { IAuthService, RegisterDto, RegisterDtoSchema } from '.'
import { IHttpResponse } from '@utils'

interface LoginBody {
  telegram_id: number
}

export class AuthController {
  constructor(
    private fastify: FastifyInstance,
    private authService: IAuthService,
    private httpResponse: IHttpResponse
  ) {
    this.router();
  }

  private async router() {
    this.fastify.post<{ Body: LoginBody }>('/login',{
      schema: {
        body: RegisterDtoSchema
      }
    }, this.login.bind(this));
    this.fastify.post<{ Body: RegisterDto }>('/register', this.register.bind(this));
  }

  private async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ) {
    const { telegram_id } = request.body;
    const auth = await this.authService.login(telegram_id);
    if (!auth) {
      return reply
        .status(404)
        .send({ success: false, message: 'User not found' })
    }

    const token = this.fastify.jwt.sign({ telegram_id: auth }, {
      expiresIn: '24h'
    })

    reply.setCookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    })

    const [payload, status] = this.httpResponse.success({
        data: {
            token
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
    const token = this.fastify.jwt.sign({ telegram_id: data.telegram_id }, { expiresIn: '24h' })
    reply.setCookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    })

    const  [payload, status] = this.httpResponse.success({
        status: 201,
        data: token
    })
    return reply.status(status).send(payload)
  }
}
