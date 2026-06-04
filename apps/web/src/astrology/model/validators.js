// src/astrology/model/validators.js

export function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

export function assertNumber(value, fieldName) {
  if (!isNumber(value)) {
    throw new Error(`Invalid chart data: "${fieldName}" must be a finite number`)
  }
}

export function assertLongitude(value, fieldName) {
  assertNumber(value, fieldName)

  if (value < 0 || value >= 360) {
    throw new Error(`Invalid chart data: "${fieldName}" must be in range 0..360`)
  }
}

export function assertPlanetData(planet, planetId) {
  if (!planet || typeof planet !== 'object') {
    throw new Error(`Invalid chart data: planet "${planetId}" is missing`)
  }

  assertLongitude(planet.longitude, `planets.${planetId}.longitude`)
  assertNumber(planet.latitude, `planets.${planetId}.latitude`)
  assertNumber(planet.distance, `planets.${planetId}.distance`)
  assertNumber(planet.speed, `planets.${planetId}.speed`)
}

export function assertHousesData(houses) {
  if (!houses || typeof houses !== 'object') {
    throw new Error('Invalid chart data: houses object is missing')
  }

  if (!Array.isArray(houses.house)) {
    throw new Error('Invalid chart data: houses.house must be an array')
  }

  if (houses.house.length !== 12) {
    throw new Error('Invalid chart data: houses.house must contain 12 values')
  }

  houses.house.forEach((cusp, index) => {
    assertLongitude(cusp, `houses.house[${index}]`)
  })

  assertLongitude(houses.ascendant, 'houses.ascendant')
  assertLongitude(houses.mc, 'houses.mc')

  if (isNumber(houses.armc)) {
    assertLongitude(houses.armc, 'houses.armc')
  }

  if (isNumber(houses.vertex)) {
    assertLongitude(houses.vertex, 'houses.vertex')
  }

  if (isNumber(houses.equatorialAscendant)) {
    assertLongitude(houses.equatorialAscendant, 'houses.equatorialAscendant')
  }

  if (isNumber(houses.kochCoAscendant)) {
    assertLongitude(houses.kochCoAscendant, 'houses.kochCoAscendant')
  }

  if (isNumber(houses.munkaseyCoAscendant)) {
    assertLongitude(houses.munkaseyCoAscendant, 'houses.munkaseyCoAscendant')
  }

  if (isNumber(houses.munkaseyPolarAscendant)) {
    assertLongitude(houses.munkaseyPolarAscendant, 'houses.munkaseyPolarAscendant')
  }
}

export function assertRawChartData(rawChart) {
  if (!rawChart || typeof rawChart !== 'object') {
    throw new Error('Invalid chart data: chart object is missing')
  }

  assertNumber(rawChart.julianDay, 'julianDay')

  if (!rawChart.planets || typeof rawChart.planets !== 'object') {
    throw new Error('Invalid chart data: planets object is missing')
  }

  assertHousesData(rawChart.houses)
}