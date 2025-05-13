import { FastifyPluginAsync } from 'fastify';
import { authPlugin } from '@modules/Auth'

const routers: FastifyPluginAsync = async (fastify, _options) => {
  fastify.register(authPlugin, {
    prefix: "/auth"
  });
};

export default routers;