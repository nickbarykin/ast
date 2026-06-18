export const DEFAULT_LAYOUT_STYLES = Object.freeze({
  zodiacSector: {
    color: '#d8c48f',
    opacity: 1,
    fillOpacity: 0.12
  },
  zodiacGlyph: {
    color: '#eadfb8',
    opacity: 1
  },
  houseSector: {
    color: '#7f94a8',
    opacity: 1,
    fillOpacity: 0.08
  },
  houseLabel: {
    color: '#aeb9c2',
    opacity: 1
  },
  planet: {
    color: '#f2f4f8',
    opacity: 1
  },
  sensitivePoint: {
    color: '#c6a6ff',
    opacity: 1
  },
  angle: {
    color: '#8bd3dd',
    opacity: 1
  },
  angleAxis: {
    color: '#8bd3dd',
    opacity: 0.75
  },
  pointAnchor: {
    color: '#9aa4af',
    opacity: 0.8
  },
  aspect: {
    color: '#c0c7d1',
    opacity: 0.35
  }
})

export function createLayoutStyles(overrides = {}) {
  return Object.fromEntries(
    Object.entries(DEFAULT_LAYOUT_STYLES).map(([styleId, style]) => [
      styleId,
      {
        ...style,
        ...(overrides[styleId] || {})
      }
    ])
  )
}
