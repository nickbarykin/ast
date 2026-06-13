import {
  PROSERPINA_CONFIG,
  PROSERPINA_METHODS
} from '../constants/proserpina';

const DAYS_IN_YEAR = 365.2422;

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

export function calculateAvestanGlobaProserpina(julianDay) {
  const config = PROSERPINA_CONFIG[PROSERPINA_METHODS.AVESTAN_GLOBA];

  const daysPassed = julianDay - config.epochJd;
  const dailyMotion = 360 / (config.periodYears * DAYS_IN_YEAR);

  const longitude = normalizeDegrees(
    config.epochLongitude + daysPassed * dailyMotion
  );

  return {
    id: 'point:proserpina',
    key: 'proserpina',
    name: 'Proserpina',
    pointType: 'hypothetical',
    pointGroup: 'minor_body',

    longitude,
    latitude: 0,
    distance: 0,
    speed: dailyMotion,

    calculation: {
      method: PROSERPINA_METHODS.AVESTAN_GLOBA,
      source: config.source,
      confidence: config.confidence
    }
  };
}