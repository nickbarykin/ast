import { normalizeChartData } from './normalizeChartData'

export function createChartModel(rawChart, options = {}) {
  const model = normalizeChartData(rawChart, options)

  return {
    ...model,

    getPoint(pointId) {
      return model.points[pointId] || null
    },

    getHouse(houseNumber) {
      return model.houses.find((house) => house.number === houseNumber) || null
    },

    getPlanets() {
      return Object.values(model.points).filter((point) => point.pointType === 'planet')
    },

    getAngles() {
      return model.angles ? Object.values(model.angles) : []
    },

    getSensitivePoints() {
      return model.sensitivePoints ? Object.values(model.sensitivePoints) : []
    },

    getRenderablePoints() {
      return Object.values(model.points)
    }
  }
}