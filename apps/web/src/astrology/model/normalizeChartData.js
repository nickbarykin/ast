// src/astrology/model/normalizeChartData.js

import {
  EntityType,
  PointType,
  AngleId,
  ZodiacMode,
  HouseSystem
} from './enums'

import {
  CHART_ID,
  CALCULATED_POINT_IDS,
  createPointId,
  createSignId
} from './ids'

import { assertRawChartData, assertPlanetData } from './validators'
import { getZodiacPosition } from './zodiac'
import { calculateAvestanGlobaProserpina } from '../points/proserpina'

import {
  longitudeToChartAngle,
  longitudeToScreenAngle,
  normalizeDegrees
} from './angle'

import {
  createHouseModel,
  findHouseByLongitude
} from './houses'

import { createSignModel } from './signs'
import { createAspectModel } from './aspects'
import { POINT_DEFINITIONS } from './pointDefinitions'

import {
  createPointSignRelation,
  createPointHouseRelation,
  createHouseSignRelation
} from './relations'

function createChartEntity(rawChart, options, ascendantLongitude, mcLongitude) {
  return {
    id: CHART_ID,
    entityId: CHART_ID,
    type: EntityType.CHART,

    chartType: options.chartType || 'natal',

    julianDay: rawChart.julianDay,
    zodiac: options.zodiac || ZodiacMode.TROPICAL,
    houseSystem: options.houseSystem || HouseSystem.PLACIDUS,

    originPointId: AngleId.ASCENDANT,
    originPointEntityId: createPointId(AngleId.ASCENDANT),

    ascendantLongitude,
    mcLongitude
  }
}

function createPlanetPoint(planetId, rawPlanet, ascendantLongitude, houses) {
  assertPlanetData(rawPlanet, planetId)

  const definition = POINT_DEFINITIONS[planetId] || {}

  const pointType =
    rawPlanet.pointType ||
    definition.pointType ||
    PointType.PLANET

  const pointGroup =
    rawPlanet.pointGroup ||
    definition.pointGroup ||
    'planet'

  const visibleByDefault =
    rawPlanet.visibleByDefault ??
    definition.visibleByDefault ??
    true

  const longitude = normalizeDegrees(rawPlanet.longitude)
  const zodiacPosition = getZodiacPosition(longitude)
  const house = findHouseByLongitude(longitude, houses)

  const chartAngle = longitudeToChartAngle(longitude, ascendantLongitude)
  const screenAngle = longitudeToScreenAngle(longitude, ascendantLongitude)

  return {
    id: planetId,
    entityId: createPointId(planetId),
    type: EntityType.POINT,
    pointType,
    pointGroup,
    visibleByDefault,

    longitude,
    latitude: rawPlanet.latitude,
    distance: rawPlanet.distance,
    speed: rawPlanet.speed,
    isRetrograde: rawPlanet.speed < 0,

    signId: zodiacPosition.signId,
    signEntityId: createSignId(zodiacPosition.signId),
    signIndex: zodiacPosition.signIndex,
    degreeInSign: zodiacPosition.degreeInSign,

    houseId: house?.id || null,
    houseEntityId: house?.entityId || null,
    houseNumber: house?.number || null,

    chartAngle,
    screenAngle,
    displayAngle: screenAngle
  }
}

function createAnglePoint(angleId, longitude, ascendantLongitude, houses) {
  const normalizedLongitude = normalizeDegrees(longitude)
  const zodiacPosition = getZodiacPosition(normalizedLongitude)
  const house = findHouseByLongitude(normalizedLongitude, houses)

  const chartAngle = longitudeToChartAngle(
    normalizedLongitude,
    ascendantLongitude
  )

  const screenAngle = longitudeToScreenAngle(
    normalizedLongitude,
    ascendantLongitude
  )

  return {
    id: angleId,
    entityId: createPointId(angleId),
    type: EntityType.POINT,
    pointType: PointType.ANGLE,
    pointGroup: 'angle',

    longitude: normalizedLongitude,

    signId: zodiacPosition.signId,
    signEntityId: createSignId(zodiacPosition.signId),
    signIndex: zodiacPosition.signIndex,
    degreeInSign: zodiacPosition.degreeInSign,

    houseId: house?.id || null,
    houseEntityId: house?.entityId || null,
    houseNumber: house?.number || null,

    chartAngle,
    screenAngle,
    displayAngle: screenAngle
  }
}

function createRelations(points, houses, signs, aspects) {
  const result = []

  const signById = Object.fromEntries(
    signs.map((sign) => [sign.id, sign])
  )

  Object.values(points).forEach((point) => {
    const sign = signById[point.signId]

    const pointSignRelation = createPointSignRelation(point, sign)

    if (pointSignRelation) {
      result.push(pointSignRelation)
    }

    const house = houses.find((item) => item.number === point.houseNumber)

    const pointHouseRelation = createPointHouseRelation(point, house)

    if (pointHouseRelation) {
      result.push(pointHouseRelation)
    }
  })

  houses.forEach((house) => {
    const sign = signById[house.signId]

    const houseSignRelation = createHouseSignRelation(house, sign)

    if (houseSignRelation) {
      result.push(houseSignRelation)
    }
  })

  aspects.forEach((aspect) => {
    result.push(aspect)
  })

  return result
}

export function normalizeChartData(rawChart, options = {}) {
  assertRawChartData(rawChart)

  const houseCusps = rawChart.houses.house.map(normalizeDegrees)
  const ascendantLongitude = normalizeDegrees(rawChart.houses.ascendant)
  const mcLongitude = normalizeDegrees(rawChart.houses.mc)

  const chart = createChartEntity(
    rawChart,
    options,
    ascendantLongitude,
    mcLongitude
  )

  const signs = createSignModel()
  const houses = createHouseModel(houseCusps)
  const points = {}
  const angles = {}
  const sensitivePoints = {}

  CALCULATED_POINT_IDS.forEach((planetId) => {
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

  const proserpinaRaw = calculateAvestanGlobaProserpina(rawChart.julianDay)
  points.proserpina = createPlanetPoint(
    'proserpina',
    proserpinaRaw,
    ascendantLongitude,
    houses
  )

  angles[AngleId.ASCENDANT] = createAnglePoint(
    AngleId.ASCENDANT,
    ascendantLongitude,
    ascendantLongitude,
    houses
  )

  angles[AngleId.DESCENDANT] = createAnglePoint(
    AngleId.DESCENDANT,
    ascendantLongitude + 180,
    ascendantLongitude,
    houses
  )

  angles[AngleId.MC] = createAnglePoint(
    AngleId.MC,
    mcLongitude,
    ascendantLongitude,
    houses
  )

  angles[AngleId.IC] = createAnglePoint(
    AngleId.IC,
    mcLongitude + 180,
    ascendantLongitude,
    houses
  )

  if (typeof rawChart.houses.vertex === 'number') {
    sensitivePoints[AngleId.VERTEX] = createAnglePoint(
      AngleId.VERTEX,
      rawChart.houses.vertex,
      ascendantLongitude,
      houses
    )
  }

  const aspectPoints = {
    ...points,
    [AngleId.ASCENDANT]: angles[AngleId.ASCENDANT],
    [AngleId.MC]: angles[AngleId.MC],
    ...sensitivePoints
  }

  const aspects = createAspectModel(aspectPoints)
  const relationPoints = {
    ...points,
    ...angles,
    ...sensitivePoints
  }

  const relations = createRelations(relationPoints, houses, signs, aspects)

  return {
    id: chart.id,
    entityId: chart.entityId,
    type: chart.type,

    chart,

    meta: {
      julianDay: chart.julianDay,
      zodiac: chart.zodiac,
      houseSystem: chart.houseSystem,
      origin: chart.originPointId,
      ascendantLongitude,
      mcLongitude
    },

    signs,
    points,
    angles,
    sensitivePoints,
    houses,
    aspects,
    relations,

    raw: rawChart
  }
}