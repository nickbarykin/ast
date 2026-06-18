function addToIndex(index, key, value) {
  if (!index[key]) {
    index[key] = []
  }

  index[key].push(value)
}

function createChartIndexes(model) {
  const relationsByEntityId = {}

  model.relations.forEach((relation) => {
    addToIndex(relationsByEntityId, relation.sourceEntityId, relation.id)
    addToIndex(relationsByEntityId, relation.targetEntityId, relation.id)
  })

  return {
    relationsByEntityId
  }
}

module.exports = {
  createChartIndexes
}
