// src/plugins/reply-decorators.ts
import { FastifyPluginAsync } from 'fastify'

export const replyDecorators: FastifyPluginAsync = async (app) => {
  app.decorateReply('success', function<T>(this: any, data: T, message = 'Success', status = 200) {
    return this.status(status).send({ success: true, message, data })
  })
  app.decorateReply('error', function(this: any, message = 'Internal Server Error', status = 500, code: string | null = null) {
    return this.status(status).send({ success: false, message, code })
  })
}