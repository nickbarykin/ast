export const PROSERPINA_METHODS = {
  AVESTAN_GLOBA: 'avestan_globa',
  ASTEROID_26: 'asteroid_26'
};

export const PROSERPINA_CONFIG = {
  [PROSERPINA_METHODS.AVESTAN_GLOBA]: {
    periodYears: 550,
    epochJd: 2451545.0,

    // временная калибровка, потом заменим на эфемериду/точный epoch
    epochLongitude: 210,

    source: 'Globa / Avestan hypothetical Proserpina',
    confidence: 'approximate'
  }
};