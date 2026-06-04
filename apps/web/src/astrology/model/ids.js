// src/astrology/model/ids.js

import { PlanetId, AngleId, SignId } from './enums'

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