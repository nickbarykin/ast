// src/astrology/model/createChartModel.js

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
      return Object.values(model.points).filter((point) => point.type === 'planet')
    },

    getAngles() {
      return Object.values(model.points).filter((point) => point.type === 'angle')
    }
  }
}