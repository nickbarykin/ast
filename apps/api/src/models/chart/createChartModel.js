const { normalizeChartData } = require('./normalizeChartData')

function createChartModel(rawChart, options = {}) {
  return normalizeChartData(rawChart, options)
}

module.exports = {
  createChartModel
}
