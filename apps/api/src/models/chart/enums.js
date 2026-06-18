const ZodiacMode = Object.freeze({
  TROPICAL: 'tropical',
  SIDEREAL: 'sidereal'
})

const HouseSystem = Object.freeze({
  PLACIDUS: 'placidus'
})

const EntityType = Object.freeze({
  CHART: 'chart',
  POINT: 'point',
  HOUSE: 'house',
  SIGN: 'sign',
  ASPECT: 'aspect',
  RELATION: 'relation'
})

const PointType = Object.freeze({
  PLANET: 'planet',
  ANGLE: 'angle',
  CALCULATED: 'calculated',
  MINOR_BODY: 'minor_body',
  HYPOTHETICAL: 'hypothetical'
})

const AngleId = Object.freeze({
  ASCENDANT: 'ascendant',
  DESCENDANT: 'descendant',
  MC: 'mc',
  IC: 'ic',
  VERTEX: 'vertex'
})

const AspectType = Object.freeze({
  CONJUNCTION: 'conjunction',
  SEXTILE: 'sextile',
  SQUARE: 'square',
  TRINE: 'trine',
  OPPOSITION: 'opposition'
})

const RelationType = Object.freeze({
  ASPECT: 'aspect',
  POINT_IN_HOUSE: 'point_in_house',
  POINT_IN_SIGN: 'point_in_sign',
  HOUSE_IN_SIGN: 'house_in_sign'
})

module.exports = {
  ZodiacMode,
  HouseSystem,
  EntityType,
  PointType,
  AngleId,
  AspectType,
  RelationType
}
