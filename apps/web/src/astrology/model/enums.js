// src/astrology/model/enums.js

export const ZodiacMode = Object.freeze({
  TROPICAL: 'tropical',
  SIDEREAL: 'sidereal'
})

export const HouseSystem = Object.freeze({
  PLACIDUS: 'placidus',
  KOCH: 'koch',
  WHOLE_SIGN: 'whole_sign',
  EQUAL: 'equal'
})

export const PointType = Object.freeze({
  PLANET: 'planet',
  ANGLE: 'angle',
  LUNAR_NODE: 'lunar_node',
  ASTEROID: 'asteroid',
  LOT: 'lot',
  VIRTUAL: 'virtual'
})

export const PlanetId = Object.freeze({
  SUN: 'sun',
  MOON: 'moon',
  MERCURY: 'mercury',
  VENUS: 'venus',
  MARS: 'mars',
  JUPITER: 'jupiter',
  SATURN: 'saturn',
  URANUS: 'uranus',
  NEPTUNE: 'neptune',
  PLUTO: 'pluto'
})

export const AngleId = Object.freeze({
  ASCENDANT: 'ascendant',
  MC: 'mc',
  DESCENDANT: 'descendant',
  IC: 'ic',
  VERTEX: 'vertex'
})

export const SignId = Object.freeze({
  ARIES: 'aries',
  TAURUS: 'taurus',
  GEMINI: 'gemini',
  CANCER: 'cancer',
  LEO: 'leo',
  VIRGO: 'virgo',
  LIBRA: 'libra',
  SCORPIO: 'scorpio',
  SAGITTARIUS: 'sagittarius',
  CAPRICORN: 'capricorn',
  AQUARIUS: 'aquarius',
  PISCES: 'pisces'
})

export const AspectType = Object.freeze({
  CONJUNCTION: 'conjunction',
  SEXTILE: 'sextile',
  SQUARE: 'square',
  TRINE: 'trine',
  OPPOSITION: 'opposition'
})