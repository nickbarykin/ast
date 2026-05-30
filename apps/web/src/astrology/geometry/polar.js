export function polarToCartesian(
  centerX,
  centerY,
  radius,
  angle
) {
  const radians =
    (-angle - 90) * Math.PI / 180

  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians)
  }
}