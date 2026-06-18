const { EntityType, RelationType } = require('./enums')
const { createRelationId } = require('./ids')

function createRelation(type, sourceEntityId, targetEntityId, data = {}) {
  return {
    id: createRelationId(type, sourceEntityId, targetEntityId),
    entityId: createRelationId(type, sourceEntityId, targetEntityId),
    type: EntityType.RELATION,
    relationType: type,
    sourceEntityId,
    targetEntityId,
    ...data
  }
}

function createPointSignRelation(point, sign) {
  if (!point || !sign) {
    return null
  }

  return createRelation(
    RelationType.POINT_IN_SIGN,
    point.entityId,
    sign.entityId,
    {
      pointId: point.id,
      signId: sign.id
    }
  )
}

function createPointHouseRelation(point, house) {
  if (!point || !house) {
    return null
  }

  return createRelation(
    RelationType.POINT_IN_HOUSE,
    point.entityId,
    house.entityId,
    {
      pointId: point.id,
      houseId: house.id,
      houseNumber: house.number
    }
  )
}

function createHouseSignRelation(house, sign) {
  if (!house || !sign) {
    return null
  }

  return createRelation(
    RelationType.HOUSE_IN_SIGN,
    house.entityId,
    sign.entityId,
    {
      houseId: house.id,
      houseNumber: house.number,
      signId: sign.id
    }
  )
}

function createAspectRelation(aspect) {
  if (!aspect) {
    return null
  }

  return createRelation(
    RelationType.ASPECT,
    aspect.sourceEntityId,
    aspect.targetEntityId,
    {
      aspectId: aspect.id,
      pointAId: aspect.pointAId,
      pointBId: aspect.pointBId,
      aspectType: aspect.aspectType
    }
  )
}

function createRelations(points, houses, signs, aspects) {
  const result = []
  const signById = Object.fromEntries(signs.map((sign) => [sign.id, sign]))

  Object.values(points).forEach((point) => {
    const sign = signById[point.signId]
    const house = houses.find((item) => item.number === point.houseNumber)
    const pointSignRelation = createPointSignRelation(point, sign)
    const pointHouseRelation = createPointHouseRelation(point, house)

    if (pointSignRelation) {
      result.push(pointSignRelation)
    }

    if (pointHouseRelation) {
      result.push(pointHouseRelation)
    }
  })

  houses.forEach((house) => {
    const houseSignRelation = createHouseSignRelation(
      house,
      signById[house.signId]
    )

    if (houseSignRelation) {
      result.push(houseSignRelation)
    }
  })

  aspects.forEach((aspect) => {
    const aspectRelation = createAspectRelation(aspect)

    if (aspectRelation) {
      result.push(aspectRelation)
    }
  })

  return result
}

module.exports = {
  createRelations
}
