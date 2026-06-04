// src/astrology/model/angle.js

export function normalizeDegrees(value) {
  const result = value % 360

  if (result < 0) {
    return result + 360
  }

  return result
}

export function getClockwiseDistance(from, to) {
  return normalizeDegrees(to - from)
}

export function getCounterClockwiseDistance(from, to) {
  return normalizeDegrees(from - to)
}

export function getShortestAngularDistance(a, b) {
  const diff = Math.abs(normalizeDegrees(a - b))

  return Math.min(diff, 360 - diff)
}

export function rotateLongitude(longitude, originLongitude) {
  return normalizeDegrees(longitude - originLongitude)
}

/**
 * Converts astrological longitude to SVG angle.
 *
 * Astrology:
 * - 0 Aries starts at 0°
 * - signs usually go counter-clockwise on the chart
 *
 * SVG:
 * - 0° is usually top after polar conversion
 * - positive angles often go clockwise depending on implementation
 *
 * For our chart we keep this function centralized,
 * so we do not guess rotation inside components.
 */
export function longitudeToChartAngle(longitude, ascendantLongitude = 0) {
  return normalizeDegrees(180 - rotateLongitude(longitude, ascendantLongitude))
}