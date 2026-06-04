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

export function longitudeToChartAngle(longitude, ascendantLongitude = 0) {
  return normalizeDegrees(180 - rotateLongitude(longitude, ascendantLongitude))
}

/**
 * Final conversion from chart-space angle to screen-space angle.
 *
 * For now chart angle and screen angle are the same,
 * because polarToCartesian already applies its own SVG correction:
 *
 * radians = (angle - 90) * Math.PI / 180
 *
 * But this function must exist so rendering code never directly depends
 * on astrology math.
 */
export function chartAngleToScreenAngle(chartAngle) {
  return normalizeDegrees(chartAngle)
}

export function longitudeToScreenAngle(longitude, ascendantLongitude = 0) {
  return chartAngleToScreenAngle(
    longitudeToChartAngle(longitude, ascendantLongitude)
  )
}