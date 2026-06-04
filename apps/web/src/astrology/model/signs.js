// src/astrology/model/signs.js

import { EntityType } from './enums'
import { SIGN_IDS, createSignId } from './ids'

export function createSignModel() {
  return SIGN_IDS.map((signId, index) => {
    const startLongitude = index * 30
    const endLongitude = startLongitude + 30

    return {
      id: signId,
      entityId: createSignId(signId),
      type: EntityType.SIGN,

      index,
      number: index + 1,

      startLongitude,
      endLongitude,
      size: 30
    }
  })
}