// В Fastify используется система плагинов вместо роутеров Express
import { FastifyPluginAsync } from 'fastify';

// Создаем плагин для маршрутизации
const router: FastifyPluginAsync = async (fastify, _options) => {
  // Здесь должны быть другие маршруты

  // Обработчик для несуществующих маршрутов (аналог middleware в Express)
  // Этот маршрут должен быть последним, чтобы сработать только если ни один другой маршрут не подошел
  fastify.setNotFoundHandler((_request, reply) => {
    reply.status(404).send({ message: "Not found" });
  });
};

export default router;