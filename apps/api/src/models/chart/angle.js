function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360
}

function oppositeLongitude(longitude) {
  return normalizeDegrees(longitude + 180)
}

function getClockwiseDistance(from, to) {
  return normalizeDegrees(to - from)
}

function getShortestAngularDistance(a, b) {
  const diff = Math.abs(normalizeDegrees(a - b))

  return Math.min(diff, 360 - diff)
}

function longitudeToChartAngle(longitude, ascendantLongitude) {
  return normalizeDegrees(longitude - ascendantLongitude + 180)
}

function longitudeToScreenAngle(longitude, ascendantLongitude) {
  return longitudeToChartAngle(longitude, ascendantLongitude)
}

module.exports = {
  normalizeDegrees,
  oppositeLongitude,
  getClockwiseDistance,
  getShortestAngularDistance,
  longitudeToChartAngle,
  longitudeToScreenAngle
}
