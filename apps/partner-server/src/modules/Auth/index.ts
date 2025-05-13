export * from "./auth.dto"
export * from "./auth.service"
export * from "./auth.controller"

import { FastifyPluginAsync } from 'fastify'
import { AuthController, AuthService } from '.'
import { db } from '@db'

export const authPlugin: FastifyPluginAsync = async (fastify) => {
  const a = typeof fastify.jwt;
  const service = new AuthService(db)
  new AuthController(fastify, service)
}