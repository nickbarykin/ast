const Fastify = require('fastify')
const chartRoutes = require('./routes/chart')
const cors = require('@fastify/cors')

const fastify = Fastify({
  logger: true
})

fastify.register(cors, {
  origin: true
})

fastify.get('/', async () => {
  return {
    status: 'ok'
  }
})

fastify.register(chartRoutes, {
  prefix: '/api'
})

const start = async () => {
  try {
    await fastify.listen({
      port: 3000,
      host: '0.0.0.0'
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()