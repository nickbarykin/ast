// src/astrology/model/ids.js

import {
  PlanetId,
  AngleId,
  SignId,
  ExtraPointId
} from './enums'

export const PLANET_IDS = Object.freeze([
  PlanetId.SUN,
  PlanetId.MOON,
  PlanetId.MERCURY,
  PlanetId.VENUS,
  PlanetId.MARS,
  PlanetId.JUPITER,
  PlanetId.SATURN,
  PlanetId.URANUS,
  PlanetId.NEPTUNE,
  PlanetId.PLUTO
])

export const ANGLE_IDS = Object.freeze([
  AngleId.ASCENDANT,
  AngleId.MC,
  AngleId.DESCENDANT,
  AngleId.IC,
  AngleId.VERTEX
])

export const SIGN_IDS = Object.freeze([
  SignId.ARIES,
  SignId.TAURUS,
  SignId.GEMINI,
  SignId.CANCER,
  SignId.LEO,
  SignId.VIRGO,
  SignId.LIBRA,
  SignId.SCORPIO,
  SignId.SAGITTARIUS,
  SignId.CAPRICORN,
  SignId.AQUARIUS,
  SignId.PISCES
])

export const CHART_ID = 'chart:natal'

export function createPointId(pointId) {
  return `point:${pointId}`
}

export function createHouseId(houseNumber) {
  return `house:${houseNumber}`
}

export function createSignId(signId) {
  return `sign:${signId}`
}

export function createAspectId(pointAId, pointBId, aspectType) {
  return `aspect:${pointAId}:${pointBId}:${aspectType}`
}

export function createRelationId(type, sourceId, targetId) {
  return `relation:${type}:${sourceId}:${targetId}`
}

export const EXTRA_POINT_IDS = Object.freeze([
  ExtraPointId.CHIRON,
  ExtraPointId.NORTH_NODE_MEAN,
  ExtraPointId.SOUTH_NODE_MEAN,
  ExtraPointId.NORTH_NODE_TRUE,
  ExtraPointId.SOUTH_NODE_TRUE,
  ExtraPointId.LILITH_MEAN,
  ExtraPointId.LILITH_OSCULATING
])

export const CALCULATED_POINT_IDS = Object.freeze([
  ...PLANET_IDS,
  ...EXTRA_POINT_IDS
])