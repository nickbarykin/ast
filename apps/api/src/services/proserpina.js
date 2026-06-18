const {
  PROSERPINA_CONFIG,
  PROSERPINA_METHODS
} = require('../constants/proserpina')

const DAYS_IN_YEAR = 365.2422

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360
}

function calculateAvestanGlobaProserpina(julianDay) {
  const config = PROSERPINA_CONFIG[PROSERPINA_METHODS.AVESTAN_GLOBA]
  const daysPassed = julianDay - config.epochJd
  const dailyMotion = 360 / (config.periodYears * DAYS_IN_YEAR)
  const longitude = normalizeDegrees(
    config.epochLongitude + daysPassed * dailyMotion
  )

  return {
    longitude,
    latitude: 0,
    distance: 0,
    speed: dailyMotion,
    pointType: 'hypothetical',
    pointGroup: 'minor_body',
    calculation: {
      method: PROSERPINA_METHODS.AVESTAN_GLOBA,
      source: config.source,
      confidence: config.confidence
    }
  }
}

module.exports = {
  calculateAvestanGlobaProserpina
}
