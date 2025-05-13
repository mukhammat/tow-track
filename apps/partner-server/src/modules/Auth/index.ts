export * from "./auth.dto"
export * from "./auth.service"
export * from "./auth.controller"

import { FastifyPluginAsync } from 'fastify'
import { AuthController, AuthService } from '.'

export const authPlugin: FastifyPluginAsync = async (fastify) => {
  const service = new AuthService(fastify.db, fastify.jwt);
  new AuthController(fastify, service)
}