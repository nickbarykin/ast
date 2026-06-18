const { PointType } = require('./enums')

const POINT_GROUP = Object.freeze({
  LUMINARY: 'luminary',
  PLANET: 'planet',
  ANGLE: 'angle',
  NODE: 'node',
  FICTIONAL: 'fictional',
  ASTEROID: 'asteroid'
})

const POINT_DEFINITIONS = Object.freeze({
  sun: {
    pointType: PointType.PLANET,
    pointGroup: POINT_GROUP.LUMINARY
  },
  moon: {
    pointType: PointType.PLANET,
    pointGroup: POINT_GROUP.LUMINARY
  },
  mercury: {
    pointType: PointType.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },
  venus: {
    pointType: PointType.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },
  mars: {
    pointType: PointType.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },
  jupiter: {
    pointType: PointType.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },
  saturn: {
    pointType: PointType.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },
  uranus: {
    pointType: PointType.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },
  neptune: {
    pointType: PointType.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },
  pluto: {
    pointType: PointType.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },
  chiron: {
    pointType: PointType.MINOR_BODY,
    pointGroup: POINT_GROUP.ASTEROID
  },
  northNodeMean: {
    pointType: PointType.CALCULATED,
    pointGroup: POINT_GROUP.NODE,
    visibleByDefault: false
  },
  southNodeMean: {
    pointType: PointType.CALCULATED,
    pointGroup: POINT_GROUP.NODE,
    visibleByDefault: false
  },
  northNodeTrue: {
    pointType: PointType.CALCULATED,
    pointGroup: POINT_GROUP.NODE,
    visibleByDefault: true
  },
  southNodeTrue: {
    pointType: PointType.CALCULATED,
    pointGroup: POINT_GROUP.NODE,
    visibleByDefault: true
  },
  lilithMean: {
    pointType: PointType.CALCULATED,
    pointGroup: POINT_GROUP.FICTIONAL,
    visibleByDefault: true
  },
  lilithOsculating: {
    pointType: PointType.CALCULATED,
    pointGroup: POINT_GROUP.FICTIONAL,
    visibleByDefault: false
  },
  proserpina: {
    pointType: PointType.HYPOTHETICAL,
    pointGroup: POINT_GROUP.FICTIONAL,
    visibleByDefault: true
  }
})

module.exports = {
  POINT_DEFINITIONS
}
