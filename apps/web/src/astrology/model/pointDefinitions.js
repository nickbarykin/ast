export const POINT_GROUP = {
  LUMINARY: 'luminary',
  PLANET: 'planet',
  ANGLE: 'angle',
  NODE: 'node',
  FICTIONAL: 'fictional',
  ASTEROID: 'asteroid',
  CALCULATED: 'calculated'
}

export const POINT_TYPE = {
  PLANET: 'planet',
  ANGLE: 'angle',
  CALCULATED: 'calculated',
  MINOR_BODY: 'minor_body'
}

export const POINT_DEFINITIONS = {
  sun: {
    pointType: POINT_TYPE.PLANET,
    pointGroup: POINT_GROUP.LUMINARY
  },

  moon: {
    pointType: POINT_TYPE.PLANET,
    pointGroup: POINT_GROUP.LUMINARY
  },

  mercury: {
    pointType: POINT_TYPE.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },

  venus: {
    pointType: POINT_TYPE.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },

  mars: {
    pointType: POINT_TYPE.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },

  jupiter: {
    pointType: POINT_TYPE.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },

  saturn: {
    pointType: POINT_TYPE.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },

  uranus: {
    pointType: POINT_TYPE.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },

  neptune: {
    pointType: POINT_TYPE.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },

  pluto: {
    pointType: POINT_TYPE.PLANET,
    pointGroup: POINT_GROUP.PLANET
  },

  ascendant: {
    pointType: POINT_TYPE.ANGLE,
    pointGroup: POINT_GROUP.ANGLE
  },

  descendant: {
    pointType: POINT_TYPE.ANGLE,
    pointGroup: POINT_GROUP.ANGLE
  },

  mc: {
    pointType: POINT_TYPE.ANGLE,
    pointGroup: POINT_GROUP.ANGLE
  },

  ic: {
    pointType: POINT_TYPE.ANGLE,
    pointGroup: POINT_GROUP.ANGLE
  },

  vertex: {
    pointType: POINT_TYPE.CALCULATED,
    pointGroup: POINT_GROUP.CALCULATED
  },

  chiron: {
    pointType: POINT_TYPE.MINOR_BODY,
    pointGroup: POINT_GROUP.ASTEROID
  },

  northNodeMean: {
    pointType: POINT_TYPE.CALCULATED,
    pointGroup: POINT_GROUP.NODE,
    visibleByDefault: false
  },

  southNodeMean: {
    pointType: POINT_TYPE.CALCULATED,
    pointGroup: POINT_GROUP.NODE,
    visibleByDefault: false
  },

  northNodeTrue: {
    pointType: POINT_TYPE.CALCULATED,
    pointGroup: POINT_GROUP.NODE,
    visibleByDefault: true
  },

  southNodeTrue: {
    pointType: POINT_TYPE.CALCULATED,
    pointGroup: POINT_GROUP.NODE,
    visibleByDefault: true
  },

  lilithMean: {
    pointType: POINT_TYPE.CALCULATED,
    pointGroup: POINT_GROUP.FICTIONAL,
    visibleByDefault: true
  },

  lilithOsculating: {
    pointType: POINT_TYPE.CALCULATED,
    pointGroup: POINT_GROUP.FICTIONAL,
    visibleByDefault: false
  },
  
  proserpina: {
    pointType: POINT_TYPE.CALCULATED,
    pointGroup: POINT_GROUP.FICTIONAL,
    visibleByDefault: true,
    calculationMethod: 'avestan_globa'
  }
}