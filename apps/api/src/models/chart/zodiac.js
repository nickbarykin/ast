const { SIGN_IDS } = require('./ids')
const { normalizeDegrees } = require('./angle')

function getSignIndex(longitude) {
  return Math.floor(normalizeDegrees(longitude) / 30)
}

function getSignId(longitude) {
  return SIGN_IDS[getSignIndex(longitude)]
}

function getDegreeInSign(longitude) {
  return normalizeDegrees(longitude) % 30
}

function getZodiacPosition(longitude) {
  const normalized = normalizeDegrees(longitude)

  return {
    longitude: normalized,
    signIndex: getSignIndex(normalized),
    signId: getSignId(normalized),
    degreeInSign: getDegreeInSign(normalized)
  }
}

module.exports = {
  getZodiacPosition
}
