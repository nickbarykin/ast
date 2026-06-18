function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360
}

function angleDistance(a, b) {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b))

  return Math.min(diff, 360 - diff)
}

function getLaneRadii({
  innerRadius,
  outerRadius,
  laneCount
}) {
  if (laneCount <= 1) {
    return [(innerRadius + outerRadius) / 2]
  }

  const step = (outerRadius - innerRadius) / (laneCount + 1)

  return Array.from({ length: laneCount }, (_, index) => {
    return innerRadius + step * (index + 1)
  })
}

function getMainLaneIndex(laneCount) {
  if (laneCount <= 1) {
    return 0
  }

  if (laneCount === 2) {
    return 0
  }

  return Math.floor((laneCount - 1) / 2)
}

function getLanePriority(laneCount) {
  const main = getMainLaneIndex(laneCount)

  return Array.from({ length: laneCount }, (_, index) => index)
    .sort((a, b) => {
      const distanceA = Math.abs(a - main)
      const distanceB = Math.abs(b - main)

      if (distanceA !== distanceB) {
        return distanceA - distanceB
      }

      return a - b
    })
}

function canPlaceOnLane(point, lanePoints, minAngleDistance) {
  return lanePoints.every((placedPoint) => {
    return angleDistance(point.screenAngle, placedPoint.screenAngle) >= minAngleDistance
  })
}

function createLaneLayout(points, laneCount, minAngleDistance) {
  const lanes = Array.from({ length: laneCount }, () => [])
  const lanePriority = getLanePriority(laneCount)

  points.forEach((point) => {
    const laneIndex = lanePriority.find((candidateLaneIndex) => {
      return canPlaceOnLane(
        point,
        lanes[candidateLaneIndex],
        minAngleDistance
      )
    })

    if (laneIndex == null) {
      return false
    }

    lanes[laneIndex].push(point)

    point.laneIndex = laneIndex

    return true
  })

  return {
    lanes,
    success: points.every((point) => point.laneIndex != null)
  }
}

export function layoutPlanetLanes(points, options = {}) {
  const innerRadius = options.innerRadius ?? 210
  const outerRadius = options.outerRadius ?? 280
  const minAngleDistance = options.minAngleDistance ?? 8
  const maxLaneCount = options.maxLaneCount ?? 4

  const layoutPoints = points
    .map((point) => ({
      ...point,
      screenAngle: normalizeAngle(point.screenAngle),
      laneIndex: null
    }))
    .sort((a, b) => a.screenAngle - b.screenAngle)

  let result = null
  let laneCount = 1

  for (; laneCount <= maxLaneCount; laneCount += 1) {
    result = createLaneLayout(
      layoutPoints.map((point) => ({
        ...point,
        laneIndex: null
      })),
      laneCount,
      minAngleDistance
    )

    if (result.success) {
      break
    }
  }

  const radii = getLaneRadii({
    innerRadius,
    outerRadius,
    laneCount
  })

  return result.lanes.flatMap((lane, index) => {
    return lane.map((point) => ({
      ...point,
      laneIndex: index,
      radius: radii[index],
      needsConnector: index !== getMainLaneIndex(laneCount)
    }))
  })
}