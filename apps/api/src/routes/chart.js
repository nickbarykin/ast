const chartSchema = require('../schemas/chartSchema')
const { buildChart } = require('../services/astrology')
const { createChartModel } = require('../models/chart/createChartModel')

function handleChartError(reply, error) {
  console.error(error)

  reply.code(400)

  return {
    error: 'Invalid request',
    message: error.message,
    issues: error.issues ?? null
  }
}

async function chartRoutes(fastify) {
  fastify.post('/chart/normalized', async (request, reply) => {
    try {
      const data = chartSchema.parse(request.body)
      const rawChart = await buildChart(data)

      return createChartModel(rawChart)
    } catch (error) {
      return handleChartError(reply, error)
    }
  })
}

module.exports = chartRoutes
