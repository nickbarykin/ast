function indexBy(items, getKey) {
  return Object.fromEntries(
    items
      .map((item) => [getKey(item), item])
      .filter(([key]) => key != null)
  )
}

/**
 * Wraps a normalized server snapshot with read helpers used by UI layers.
 * It does not recalculate astrology; it only indexes already-normalized data.
 */
export function createChartAccessModel(snapshot) {
  const relationById = indexBy(snapshot.relations, (relation) => relation.id)

  function getRelation(relationId) {
    return relationById[relationId] || null
  }

  function getRelationsForEntity(entityId) {
    const relationIds = snapshot.indexes?.relationsByEntityId?.[entityId] || []

    return relationIds
      .map(getRelation)
      .filter(Boolean)
  }

  return {
    ...snapshot,

    getPoint(pointId) {
      return snapshot.points[pointId] || null
    },

    getAngle(angleId) {
      return snapshot.angles[angleId] || null
    },

    getHouses() {
      return snapshot.houses
    },

    getRelationsForEntity
  }
}
