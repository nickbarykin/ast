// src/astrology/model/relations.js

import { EntityType, RelationType } from './enums'
import { createRelationId } from './ids'

export function createRelation(type, sourceEntityId, targetEntityId, data = {}) {
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

export function createPointSignRelation(point, sign) {
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

export function createPointHouseRelation(point, house) {
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

export function createHouseSignRelation(house, sign) {
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

export function createAspectRelation(aspect) {
  if (!aspect) {
    return null
  }

  return createRelation(
    RelationType.ASPECT,
    aspect.entityId,
    aspect.targetEntityId,
    {
      aspectId: aspect.id,
      pointAId: aspect.pointAId,
      pointBId: aspect.pointBId,
      aspectType: aspect.aspectType,
      exactAngle: aspect.exactAngle,
      actualAngle: aspect.actualAngle,
      orb: aspect.orb
    }
  )
}