import { SENSITIVE_POINTS } from '../constants/sensitivePoints'
import { oppositeLongitude } from '../math/angle'
import { getAspectTargets } from '../selectors/getAspectTargets'
// import { calculateAvestanGlobaProserpina } from '../points/proserpina';

export function normalizeChart(rawChart) {
  const houses = normalizeHouses(rawChart)
  const points = normalizePoints(rawChart)
  const angles = normalizeAngles(rawChart)
  const sensitivePoints = normalizeSensitivePoints(rawChart)

  const chart = {
    id: 'chart:natal',
    type: 'natal',

    points,
    houses,
    angles,
    sensitivePoints,

    ascendantLongitude: angles.asc.longitude
  }

  // const proserpina = calculateAvestanGlobaProserpina(rawChart.julianDay);
  // points.proserpina = proserpina;

  // Потом подключим нормальный расчет аспектов.
  chart.aspectTargets = getAspectTargets(chart)
  chart.aspects = []

console.log('RAW PLANET KEYS', Object.keys(rawChart.planets || {}))
console.log('NORMALIZED POINT KEYS', Object.keys(points))

  return chart
}

function normalizeHouses(rawChart) {
  const cusps = rawChart.houses?.cusps || []

  return cusps.map((longitude, index) => ({
    id: `house:${index + 1}`,
    key: String(index + 1),
    number: index + 1,
    longitude
  }))
}

function normalizePoints(rawChart) {
  const planets = rawChart.planets || {}

  const excludedPointKeys = new Set([
    'asc',
    'ascendant',
    'dsc',
    'descendant',
    'mc',
    'midheaven',
    'ic',
    'imumCoeli',
    'imum_coeli',
    'vertex'
  ])

  return Object.entries(planets).reduce((result, [key, value]) => {
    if (excludedPointKeys.has(key)) {
      return result
    }

    result[key] = {
      id: `point:${key}`,
      key,
      name: key,
      longitude: value.longitude,
      latitude: value.latitude,
      distance: value.distance,
      speed: value.speed,
      pointType: value.pointType,
      pointGroup: value.pointGroup
    }

    return result
  }, {})
}

function normalizeAngles(rawChart) {
  const asc = rawChart.houses.ascendant
  const mc = rawChart.houses.mc

  return {
    asc: {
      id: 'angle:asc',
      key: 'asc',
      abbreviation: 'ASC',
      name: 'Ascendant',
      longitude: asc
    },

    dsc: {
      id: 'angle:dsc',
      key: 'dsc',
      abbreviation: 'DSC',
      name: 'Descendant',
      longitude: oppositeLongitude(asc)
    },

    mc: {
      id: 'angle:mc',
      key: 'mc',
      abbreviation: 'MC',
      name: 'Midheaven',
      longitude: mc
    },

    ic: {
      id: 'angle:ic',
      key: 'ic',
      abbreviation: 'IC',
      name: 'Imum Coeli',
      longitude: oppositeLongitude(mc)
    }
  }
}

function normalizeSensitivePoints(rawChart) {
  const result = {}

  if (rawChart.houses?.vertex != null) {
    result.vertex = {
      ...SENSITIVE_POINTS.vertex,
      longitude: rawChart.houses.vertex
    }

    result.antiVertex = {
      ...SENSITIVE_POINTS.antiVertex,
      longitude: oppositeLongitude(rawChart.houses.vertex)
    }
  }

  return result
}