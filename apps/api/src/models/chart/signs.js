const { EntityType } = require('./enums')
const { SIGN_IDS, createSignId } = require('./ids')

function createSignModel() {
  return SIGN_IDS.map((signId, index) => {
    const startLongitude = index * 30

    return {
      id: signId,
      entityId: createSignId(signId),
      type: EntityType.SIGN,
      index,
      number: index + 1,
      startLongitude,
      endLongitude: startLongitude + 30,
      size: 30
    }
  })
}

module.exports = {
  createSignModel
}
