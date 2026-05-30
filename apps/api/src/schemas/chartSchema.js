const { z } = require('zod')

const chartSchema = z.object({
  date: z.string(),
  time: z.string(),
  lat: z.number(),
  lon: z.number(),
  timezone: z.string()
})

module.exports = chartSchema