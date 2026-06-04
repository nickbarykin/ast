// src/astrology/model/zodiac.js

import { SIGN_IDS } from './ids'
import { normalizeDegrees } from './angle'

export function getSignIndex(longitude) {
  return Math.floor(normalizeDegrees(longitude) / 30)
}

export function getSignId(longitude) {
  return SIGN_IDS[getSignIndex(longitude)]
}

export function getDegreeInSign(longitude) {
  return normalizeDegrees(longitude) % 30
}

export function getZodiacPosition(longitude) {
  const normalized = normalizeDegrees(longitude)

  return {
    longitude: normalized,
    signIndex: getSignIndex(normalized),
    signId: getSignId(normalized),
    degreeInSign: getDegreeInSign(normalized)
  }
}