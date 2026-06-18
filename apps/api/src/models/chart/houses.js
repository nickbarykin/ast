const { EntityType } = require('./enums')
const { getClockwiseDistance, normalizeDegrees } = require('./angle')
const { createHouseId, createSignId } = require('./ids')
const { getZodiacPosition } = require('./zodiac')

function createHouseModel(houseCusps) {
  return houseCusps.map((cuspLongitude, index) => {
    const nextCuspLongitude = houseCusps[(index + 1) % 12]
    const size = getClockwiseDistance(cuspLongitude, nextCuspLongitude)
    const zodiacPosition = getZodiacPosition(cuspLongitude)

    return {
      id: `house_${index + 1}`,
      entityId: createHouseId(index + 1),
      type: EntityType.HOUSE,
      number: index + 1,
      cuspLongitude,
      nextCuspLongitude,
      size,
      signId: zodiacPosition.signId,
      signEntityId: createSignId(zodiacPosition.signId),
      signIndex: zodiacPosition.signIndex,
      degreeInSign: zodiacPosition.degreeInSign
    }
  })
}

function isLongitudeInsideHouse(longitude, house) {
  const normalizedLongitude = normalizeDegrees(longitude)
  const distanceFromCusp = getClockwiseDistance(
    house.cuspLongitude,
    normalizedLongitude
  )

  return distanceFromCusp >= 0 && distanceFromCusp < house.size
}

function findHouseByLongitude(longitude, houses) {
  const normalizedLongitude = normalizeDegrees(longitude)

  return houses.find((house) => (
    isLongitudeInsideHouse(normalizedLongitude, house)
  )) || null
}

module.exports = {
  createHouseModel,
  findHouseByLongitude
}
