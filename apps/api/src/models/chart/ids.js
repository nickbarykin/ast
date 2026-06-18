const CHART_ID = 'chart:natal'

const SIGN_IDS = Object.freeze([
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces'
])

const CALCULATED_POINT_IDS = Object.freeze([
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
  'chiron',
  'northNodeMean',
  'southNodeMean',
  'northNodeTrue',
  'southNodeTrue',
  'lilithMean',
  'lilithOsculating',
  'proserpina'
])

function createPointId(pointId) {
  return `point:${pointId}`
}

function createHouseId(houseNumber) {
  return `house:${houseNumber}`
}

function createSignId(signId) {
  return `sign:${signId}`
}

function createAspectId(pointAId, pointBId, aspectType) {
  return `aspect:${pointAId}:${pointBId}:${aspectType}`
}

function createRelationId(type, sourceId, targetId) {
  return `relation:${type}:${sourceId}:${targetId}`
}

module.exports = {
  CHART_ID,
  SIGN_IDS,
  CALCULATED_POINT_IDS,
  createPointId,
  createHouseId,
  createSignId,
  createAspectId,
  createRelationId
}
