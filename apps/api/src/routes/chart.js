const chartSchema = require('../schemas/chartSchema')
const { buildChart } = require('../services/astrology')

async function chartRoutes(fastify) {
  fastify.post('/chart', async (request, reply) => {
    try {
      const data = chartSchema.parse(request.body)
      const chart = await buildChart(data)

      return chart
    } catch (error) {
      console.error(error)

      reply.code(400)

      return {
        error: 'Invalid request',
        message: error.message,
        issues: error.issues ?? null
      }
    }
  })
}

module.exports = chartRoutes