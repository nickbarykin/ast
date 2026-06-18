function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360
}

function polarToCartesian(centerX, centerY, radius, angle) {
  const radians = (-angle - 90) * Math.PI / 180

  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians)
  }
}

/**
 * Converts a ring sector from layout-space angles/radii into an SVG path.
 * Render layers use this so house/zodiac geometry stays consistent without
 * knowing the path command details.
 */
export function describeArcSector({
  center,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle
}) {
  const start = normalizeAngle(startAngle)
  const end = normalizeAngle(endAngle)
  const delta = normalizeAngle(end - start)
  const largeArcFlag = delta > 180 ? 1 : 0

  const startOuter = polarToCartesian(center.x, center.y, outerRadius, start)
  const endOuter = polarToCartesian(center.x, center.y, outerRadius, end)
  const endInner = polarToCartesian(center.x, center.y, innerRadius, end)
  const startInner = polarToCartesian(center.x, center.y, innerRadius, start)

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    'Z'
  ].join(' ')
}
