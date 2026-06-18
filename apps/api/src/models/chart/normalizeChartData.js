const {
  AngleId,
  EntityType,
  HouseSystem,
  PointType,
  ZodiacMode
} = require('./enums')

const {
  CALCULATED_POINT_IDS,
  CHART_ID,
  createPointId,
  createSignId
} = require('./ids')

const {
  longitudeToChartAngle,
  longitudeToScreenAngle,
  normalizeDegrees,
  oppositeLongitude
} = require('./angle')

const { getZodiacPosition } = require('./zodiac')
const { createSignModel } = require('./signs')
const { createHouseModel, findHouseByLongitude } = require('./houses')
const { createAspectModel } = require('./aspects')
const { createRelations } = require('./relations')
const { createChartIndexes } = require('./indexes')
const { POINT_DEFINITIONS } = require('./pointDefinitions')

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

function createPoint(pointId, rawPoint, ascendantLongitude, houses) {
  const definition = POINT_DEFINITIONS[pointId] || {}
  const longitude = normalizeDegrees(rawPoint.longitude)
  const zodiacPosition = getZodiacPosition(longitude)
  const house = findHouseByLongitude(longitude, houses)
  const pointType =
    rawPoint.pointType ||
    definition.pointType ||
    PointType.PLANET

  return {
    id: pointId,
    entityId: createPointId(pointId),
    type: EntityType.POINT,
    pointType,
    pointGroup: rawPoint.pointGroup || definition.pointGroup || 'planet',
    visibleByDefault:
      rawPoint.visibleByDefault ??
      definition.visibleByDefault ??
      true,
    longitude,
    latitude: rawPoint.latitude,
    distance: rawPoint.distance,
    speed: rawPoint.speed,
    isRetrograde: rawPoint.speed < 0,
    signId: zodiacPosition.signId,
    signEntityId: createSignId(zodiacPosition.signId),
    signIndex: zodiacPosition.signIndex,
    degreeInSign: zodiacPosition.degreeInSign,
    houseId: house?.id || null,
    houseEntityId: house?.entityId || null,
    houseNumber: house?.number || null,
    chartAngle: longitudeToChartAngle(longitude, ascendantLongitude),
    screenAngle: longitudeToScreenAngle(longitude, ascendantLongitude),
    displayAngle: longitudeToScreenAngle(longitude, ascendantLongitude)
  }
}

function createAnglePoint(angleId, longitude, ascendantLongitude, houses) {
  const normalizedLongitude = normalizeDegrees(longitude)
  const zodiacPosition = getZodiacPosition(normalizedLongitude)
  const house = findHouseByLongitude(normalizedLongitude, houses)

  return {
    id: angleId,
    entityId: createPointId(angleId),
    type: EntityType.POINT,
    pointType: PointType.ANGLE,
    pointGroup: 'angle',
    visibleByDefault: true,
    longitude: normalizedLongitude,
    signId: zodiacPosition.signId,
    signEntityId: createSignId(zodiacPosition.signId),
    signIndex: zodiacPosition.signIndex,
    degreeInSign: zodiacPosition.degreeInSign,
    houseId: house?.id || null,
    houseEntityId: house?.entityId || null,
    houseNumber: house?.number || null,
    chartAngle: longitudeToChartAngle(normalizedLongitude, ascendantLongitude),
    screenAngle: longitudeToScreenAngle(normalizedLongitude, ascendantLongitude),
    displayAngle: longitudeToScreenAngle(normalizedLongitude, ascendantLongitude)
  }
}

function getHouseCusps(rawChart) {
  const houseCusps = Array.isArray(rawChart.houses?.house)
    ? rawChart.houses.house
    : rawChart.houses?.cusps

  if (!Array.isArray(houseCusps) || houseCusps.length !== 12) {
    throw new Error('Invalid chart data: houses.house must contain 12 values')
  }

  return houseCusps
}

function normalizeChartData(rawChart, options = {}) {
  const houseCusps = getHouseCusps(rawChart).map(normalizeDegrees)
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
  const rawPoints = rawChart.points || rawChart.planets || {}

  CALCULATED_POINT_IDS.forEach((pointId) => {
    if (!rawPoints[pointId]) {
      return
    }

    points[pointId] = createPoint(
      pointId,
      rawPoints[pointId],
      ascendantLongitude,
      houses
    )
  })

  angles[AngleId.ASCENDANT] = createAnglePoint(
    AngleId.ASCENDANT,
    ascendantLongitude,
    ascendantLongitude,
    houses
  )

  angles[AngleId.DESCENDANT] = createAnglePoint(
    AngleId.DESCENDANT,
    oppositeLongitude(ascendantLongitude),
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
    oppositeLongitude(mcLongitude),
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
  const model = {
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
    relations
  }

  return {
    ...model,
    indexes: createChartIndexes(model)
  }
}

module.exports = {
  normalizeChartData
}
