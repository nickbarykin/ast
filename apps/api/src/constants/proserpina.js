const PROSERPINA_METHODS = Object.freeze({
  AVESTAN_GLOBA: 'avestan_globa',
  ASTEROID_26: 'asteroid_26'
})

const PROSERPINA_CONFIG = Object.freeze({
  [PROSERPINA_METHODS.AVESTAN_GLOBA]: {
    periodYears: 550,
    epochJd: 2451545.0,
    epochLongitude: 210,
    source: 'Globa / Avestan hypothetical Proserpina',
    confidence: 'approximate'
  }
})

module.exports = {
  PROSERPINA_METHODS,
  PROSERPINA_CONFIG
}
