export const RING_ID = {
  ASPECT_FIELD: 'ring:aspect-field',
  POINT_ANCHORS: 'ring:point-anchors',
  SENSITIVE_POINTS: 'ring:sensitive-points',
  PLANETS: 'ring:planets',
  HOUSES: 'ring:houses',
  ZODIAC: 'ring:zodiac',
  ANGLES: 'ring:angles'
}

export const DEFAULT_NATAL_RINGS = Object.freeze({
  [RING_ID.ASPECT_FIELD]: {
    id: RING_ID.ASPECT_FIELD,
    role: 'aspect-field',
    innerRadius: 0,
    outerRadius: 170,
    resizable: true,
    resizeHandle: 'outer',
    animatedProperties: ['outerRadius', 'opacity']
  },
  [RING_ID.POINT_ANCHORS]: {
    id: RING_ID.POINT_ANCHORS,
    role: 'point-anchors',
    radius: 170,
    resizable: true,
    resizeHandle: 'radius',
    animatedProperties: ['radius', 'opacity']
  },
  [RING_ID.SENSITIVE_POINTS]: {
    id: RING_ID.SENSITIVE_POINTS,
    role: 'sensitive-points',
    innerRadius: 176,
    outerRadius: 198,
    resizable: true,
    resizeHandle: 'both',
    animatedProperties: ['innerRadius', 'outerRadius', 'opacity']
  },
  [RING_ID.PLANETS]: {
    id: RING_ID.PLANETS,
    role: 'planets',
    innerRadius: 198,
    outerRadius: 258,
    resizable: true,
    resizeHandle: 'both',
    minAngleDistance: 8,
    maxLaneCount: 4,
    animatedProperties: ['innerRadius', 'outerRadius', 'opacity']
  },
  [RING_ID.HOUSES]: {
    id: RING_ID.HOUSES,
    role: 'houses',
    innerRadius: 180,
    outerRadius: 260,
    labelRadius: 220,
    resizable: true,
    resizeHandle: 'both',
    animatedProperties: ['innerRadius', 'outerRadius', 'labelRadius', 'opacity']
  },
  [RING_ID.ZODIAC]: {
    id: RING_ID.ZODIAC,
    role: 'zodiac',
    innerRadius: 260,
    outerRadius: 300,
    labelRadius: 280,
    resizable: true,
    resizeHandle: 'both',
    animatedProperties: ['innerRadius', 'outerRadius', 'labelRadius', 'opacity']
  },
  [RING_ID.ANGLES]: {
    id: RING_ID.ANGLES,
    role: 'angles',
    axisRadius: 300,
    labelRadius: 318,
    resizable: true,
    resizeHandle: 'radius',
    animatedProperties: ['axisRadius', 'labelRadius', 'opacity']
  }
})

/**
 * Resolves dependent natal rings from the editable house ring.
 * Houses are the base: aspects stay inside them, points live on them,
 * zodiac starts outside them, and angles extend beyond zodiac.
 */
function resolveNatalRingDependencies(rings) {
  const houses = rings[RING_ID.HOUSES]
  const zodiacWidth = rings[RING_ID.ZODIAC].width ?? (
    rings[RING_ID.ZODIAC].outerRadius - rings[RING_ID.ZODIAC].innerRadius
  )
  const angleOffset = rings[RING_ID.ANGLES].axisOffset ?? 10
  const angleLabelOffset = rings[RING_ID.ANGLES].labelOffset ?? 18
  const aspectGap = rings[RING_ID.ASPECT_FIELD].outerGap ?? 10
  const anchorGap = rings[RING_ID.POINT_ANCHORS].innerGap ?? 10

  return {
    ...rings,
    [RING_ID.ASPECT_FIELD]: {
      ...rings[RING_ID.ASPECT_FIELD],
      innerRadius: 0,
      outerRadius: Math.max(0, houses.innerRadius - aspectGap)
    },
    [RING_ID.POINT_ANCHORS]: {
      ...rings[RING_ID.POINT_ANCHORS],
      radius: Math.max(0, houses.innerRadius - anchorGap)
    },
    [RING_ID.SENSITIVE_POINTS]: {
      ...rings[RING_ID.SENSITIVE_POINTS],
      innerRadius: houses.innerRadius,
      outerRadius: houses.outerRadius
    },
    [RING_ID.PLANETS]: {
      ...rings[RING_ID.PLANETS],
      innerRadius: houses.innerRadius,
      outerRadius: houses.outerRadius
    },
    [RING_ID.HOUSES]: {
      ...houses,
      labelRadius: (houses.innerRadius + houses.outerRadius) / 2
    },
    [RING_ID.ZODIAC]: {
      ...rings[RING_ID.ZODIAC],
      width: zodiacWidth,
      innerRadius: houses.outerRadius,
      outerRadius: houses.outerRadius + zodiacWidth,
      labelRadius: houses.outerRadius + zodiacWidth / 2
    },
    [RING_ID.ANGLES]: {
      ...rings[RING_ID.ANGLES],
      axisOffset: angleOffset,
      labelOffset: angleLabelOffset,
      axisRadius: houses.outerRadius + zodiacWidth + angleOffset,
      labelRadius: houses.outerRadius + zodiacWidth + angleLabelOffset
    }
  }
}

export function createNatalRings(overrides = {}) {
  const rings = Object.fromEntries(
    Object.entries(DEFAULT_NATAL_RINGS).map(([ringId, ring]) => [
      ringId,
      {
        ...ring,
        ...(overrides[ringId] || {})
      }
    ])
  )

  return resolveNatalRingDependencies(rings)
}
