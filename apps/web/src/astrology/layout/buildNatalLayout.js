import { polarToCartesian } from '../geometry/polar'
import { getRotationForLongitudeAtScreenAngle } from './rotation'
import { layoutPlanetLanes } from './planetLanes'
import { createNatalRings, RING_ID } from './rings'
import { createLayoutStyles } from './styles'

function longitudeToScreenAngle(longitude, rotation = 0) {
  return longitude + rotation
}

function getPointStyleId(point) {
  if (point.pointType === 'planet') {
    return 'planet'
  }

  if (point.pointType === 'angle') {
    return 'angle'
  }

  return 'sensitivePoint'
}

function getPointRingId(point) {
  if (point.pointType === 'planet') {
    return RING_ID.PLANETS
  }

  return RING_ID.SENSITIVE_POINTS
}

function createPosition(center, radius, angle) {
  return {
    ...polarToCartesian(center.x, center.y, radius, angle),
    radius,
    angle
  }
}

function layoutHouses(chart, context) {
  const houseRing = context.rings[RING_ID.HOUSES]

  return chart.houses.map((house) => {
    const startAngle = longitudeToScreenAngle(
      house.cuspLongitude,
      context.rotation
    )

    const endAngle = longitudeToScreenAngle(
      house.nextCuspLongitude,
      context.rotation
    )

    const labelAngle = longitudeToScreenAngle(
      house.cuspLongitude + house.size / 2,
      context.rotation
    )

    return {
      entity: house,
      ringId: RING_ID.HOUSES,
      styleId: 'houseSector',
      labelStyleId: 'houseLabel',
      innerRadius: houseRing.innerRadius,
      outerRadius: houseRing.outerRadius,
      startAngle,
      endAngle,
      labelPosition: createPosition(
        context.center,
        houseRing.labelRadius,
        labelAngle
      )
    }
  })
}

function layoutSigns(chart, context) {
  const zodiacRing = context.rings[RING_ID.ZODIAC]

  return chart.signs.map((sign) => {
    const labelAngle = longitudeToScreenAngle(
      sign.startLongitude + sign.size / 2,
      context.rotation
    )

    return {
      entity: sign,
      ringId: RING_ID.ZODIAC,
      styleId: 'zodiacSector',
      labelStyleId: 'zodiacGlyph',
      innerRadius: zodiacRing.innerRadius,
      outerRadius: zodiacRing.outerRadius,
      startAngle: longitudeToScreenAngle(sign.startLongitude, context.rotation),
      endAngle: longitudeToScreenAngle(sign.endLongitude, context.rotation),
      labelPosition: createPosition(
        context.center,
        zodiacRing.labelRadius,
        labelAngle
      )
    }
  })
}

function layoutPoints(chart, context) {
  const houseRing = context.rings[RING_ID.HOUSES]
  const pointRing = context.rings[RING_ID.PLANETS]
  const anchorRing = context.rings[RING_ID.POINT_ANCHORS]

  const visiblePoints = [
    ...Object.values(chart.points),
    ...Object.values(chart.sensitivePoints || {})
  ]
    .filter((point) => point.visibleByDefault !== false)
    .map((point) => ({
      ...point,
      screenAngle: longitudeToScreenAngle(point.longitude, context.rotation)
    }))

  const laidOutPoints = layoutPlanetLanes(visiblePoints, {
    innerRadius: houseRing.innerRadius,
    outerRadius: houseRing.outerRadius,
    minAngleDistance: pointRing.minAngleDistance,
    maxLaneCount: pointRing.maxLaneCount
  })

  return laidOutPoints.map((point) => ({
    entity: point,
    ringId: getPointRingId(point),
    anchorRingId: RING_ID.POINT_ANCHORS,
    styleId: getPointStyleId(point),
    anchorStyleId: 'pointAnchor',
    laneIndex: point.laneIndex,
    needsConnector: point.needsConnector,
    position: createPosition(context.center, point.radius, point.screenAngle),
    anchorPosition: createPosition(
      context.center,
      anchorRing.radius,
      point.screenAngle
    )
  }))
}

function layoutAngles(chart, context) {
  const angleRing = context.rings[RING_ID.ANGLES]
  const angles = Object.values(chart.angles)

  const labels = angles.map((angle) => {
    const screenAngle = longitudeToScreenAngle(angle.longitude, context.rotation)

    return {
      entity: angle,
      ringId: RING_ID.ANGLES,
      styleId: 'angle',
      position: createPosition(
        context.center,
        angleRing.labelRadius,
        screenAngle
      )
    }
  })

  const axes = [
    [chart.angles.ascendant, chart.angles.descendant],
    [chart.angles.mc, chart.angles.ic]
  ].map(([from, to]) => ({
    from,
    to,
    ringId: RING_ID.ANGLES,
    styleId: 'angleAxis',
    fromPosition: createPosition(
      context.center,
      angleRing.axisRadius,
      longitudeToScreenAngle(from.longitude, context.rotation)
    ),
    toPosition: createPosition(
      context.center,
      angleRing.axisRadius,
      longitudeToScreenAngle(to.longitude, context.rotation)
    )
  }))

  return {
    labels,
    axes
  }
}

function layoutAspects(chart) {
  return chart.aspects.map((aspect) => ({
    entity: aspect,
    ringId: RING_ID.ASPECT_FIELD,
    styleId: 'aspect',
    sourceNodeId: `node:anchor:point:${aspect.pointAId}`,
    targetNodeId: `node:anchor:point:${aspect.pointBId}`
  }))
}

/**
 * Builds the semantic layout consumed by React SVG layers.
 * It converts normalized chart entities into ring-aware positions while
 * keeping rendering choices out of the astrology model.
 */
export function buildNatalLayout(chart, options = {}) {
  const width = options.width ?? 600
  const height = options.height ?? 600
  const center = {
    x: width / 2,
    y: height / 2
  }

  const rings = createNatalRings(options.rings)
  const styles = createLayoutStyles(options.styles)
  const rotation = getRotationForLongitudeAtScreenAngle(
    chart.angles.ascendant.longitude,
    90
  )

  const context = {
    width,
    height,
    center,
    rings,
    styles,
    rotation
  }

  return {
    id: options.id || 'layout:natal',
    width,
    height,
    center,
    rotation,
    rings,
    styles,
    houses: layoutHouses(chart, context),
    signs: layoutSigns(chart, context),
    points: layoutPoints(chart, context),
    angles: layoutAngles(chart, context),
    aspects: layoutAspects(chart, context)
  }
}
