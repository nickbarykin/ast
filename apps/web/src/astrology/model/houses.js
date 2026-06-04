// src/astrology/model/houses.js

import { getClockwiseDistance, normalizeDegrees } from './angle'
import { getZodiacPosition } from './zodiac'

export function createHouseModel(houseCusps) {
  return houseCusps.map((cuspLongitude, index) => {
    const nextCuspLongitude = houseCusps[(index + 1) % 12]
    const size = getClockwiseDistance(cuspLongitude, nextCuspLongitude)
    const zodiacPosition = getZodiacPosition(cuspLongitude)

    return {
      id: `house_${index + 1}`,
      number: index + 1,

      cuspLongitude,
      nextCuspLongitude,
      size,

      signId: zodiacPosition.signId,
      signIndex: zodiacPosition.signIndex,
      degreeInSign: zodiacPosition.degreeInSign
    }
  })
}

export function isLongitudeInsideHouse(longitude, house) {
  const normalizedLongitude = normalizeDegrees(longitude)
  const distanceFromCusp = getClockwiseDistance(
    house.cuspLongitude,
    normalizedLongitude
  )

  return distanceFromCusp >= 0 && distanceFromCusp < house.size
}

export function findHouseByLongitude(longitude, houses) {
  const normalizedLongitude = normalizeDegrees(longitude)
  return houses.find((house) => (
    isLongitudeInsideHouse(normalizedLongitude, house)
  )) || null

}