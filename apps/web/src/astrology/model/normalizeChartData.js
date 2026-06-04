// src/astrology/model/normalizeChartData.js

import { PointType, PlanetId, AngleId, ZodiacMode, HouseSystem } from './enums'
import { PLANET_IDS } from './ids'
import { assertRawChartData, assertPlanetData } from './validators'
import { getZodiacPosition } from './zodiac'
import { longitudeToChartAngle, normalizeDegrees } from './angle'
import { createHouseModel, findHouseByLongitude } from './houses'
import { createAspectModel } from './aspects'

function createPlanetPoint(planetId, rawPlanet, ascendantLongitude, houses) {
  assertPlanetData(rawPlanet, planetId)

  const longitude = normalizeDegrees(rawPlanet.longitude)
  const zodiacPosition = getZodiacPosition(longitude)
  const chartAngle = longitudeToChartAngle(longitude, ascendantLongitude)
  const house = findHouseByLongitude(longitude, houses)

  return {
    id: planetId,
    type: PointType.PLANET,

    longitude,
    latitude: rawPlanet.latitude,
    distance: rawPlanet.distance,
    speed: rawPlanet.speed,
    isRetrograde: rawPlanet.speed < 0,

    signId: zodiacPosition.signId,
    signIndex: zodiacPosition.signIndex,
    degreeInSign: zodiacPosition.degreeInSign,

    houseId: house?.id || null,
    houseNumber: house?.number || null,

    chartAngle,
    displayAngle: chartAngle
  }
}

function createAnglePoint(angleId, longitude, ascendantLongitude) {
  const normalizedLongitude = normalizeDegrees(longitude)
  const zodiacPosition = getZodiacPosition(normalizedLongitude)

  return {
    id: angleId,
    type: PointType.ANGLE,

    longitude: normalizedLongitude,

    signId: zodiacPosition.signId,
    signIndex: zodiacPosition.signIndex,
    degreeInSign: zodiacPosition.degreeInSign,

    chartAngle: longitudeToChartAngle(normalizedLongitude, ascendantLongitude),
    displayAngle: longitudeToChartAngle(normalizedLongitude, ascendantLongitude)
  }
}

export function normalizeChartData(rawChart, options = {}) {
  assertRawChartData(rawChart)

  const houseCusps = rawChart.houses.house.map(normalizeDegrees)
  const ascendantLongitude = normalizeDegrees(rawChart.houses.ascendant)
  const mcLongitude = normalizeDegrees(rawChart.houses.mc)

  const houses = createHouseModel(houseCusps)

  const points = {}

  PLANET_IDS.forEach((planetId) => {
    if (!rawChart.planets[planetId]) {
      return
    }

    points[planetId] = createPlanetPoint(
      planetId,
      rawChart.planets[planetId],
      ascendantLongitude,
      houses
    )
  })

  points[AngleId.ASCENDANT] = createAnglePoint(
    AngleId.ASCENDANT,
    ascendantLongitude,
    ascendantLongitude
  )

  points[AngleId.DESCENDANT] = createAnglePoint(
    AngleId.DESCENDANT,
    ascendantLongitude + 180,
    ascendantLongitude
  )

  points[AngleId.MC] = createAnglePoint(
    AngleId.MC,
    mcLongitude,
    ascendantLongitude
  )

  points[AngleId.IC] = createAnglePoint(
    AngleId.IC,
    mcLongitude + 180,
    ascendantLongitude
  )

  if (typeof rawChart.houses.vertex === 'number') {
    points[AngleId.VERTEX] = createAnglePoint(
      AngleId.VERTEX,
      rawChart.houses.vertex,
      ascendantLongitude
    )
  }

  const aspects = createAspectModel(points)

  return {
    meta: {
      julianDay: rawChart.julianDay,
      zodiac: options.zodiac || ZodiacMode.TROPICAL,
      houseSystem: options.houseSystem || HouseSystem.PLACIDUS,
      origin: AngleId.ASCENDANT,
      ascendantLongitude,
      mcLongitude
    },

    points,
    houses,
    aspects,

    raw: rawChart
  }
}