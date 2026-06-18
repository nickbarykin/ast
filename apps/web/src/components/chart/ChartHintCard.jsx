import './ChartHintCard.css'

export default function ChartHintCard({
  node,
  chartModel,
  position,
  mode = 'floating',
  fixedPosition = { x: 16, y: 16 },
  offset = { x: 12, y: 12 }
}) {
  if (!node) {
    return null
  }

  const semantic = node.semantic ?? {}
  const relations = node.entityId && chartModel
    ? chartModel.getRelationsForEntity(node.entityId)
    : []

  const cardPosition = mode === 'fixed'
    ? fixedPosition
    : {
        x: position.x + offset.x,
        y: position.y + offset.y
      }

  return (
    <div
      className="chart-hint-card"
      style={{
        left: cardPosition.x,
        top: cardPosition.y
      }}
    >
      <div className="chart-hint-card__title">
        {semantic.label ?? node.entityId ?? node.id}
      </div>

      <div className="chart-hint-card__row">
        <span>Node</span>
        <strong>{node.id}</strong>
      </div>

      {node.entityId && (
        <div className="chart-hint-card__row">
          <span>Entity</span>
          <strong>{node.entityId}</strong>
        </div>
      )}

      {node.relationId && (
        <div className="chart-hint-card__row">
          <span>Relation</span>
          <strong>{node.relationId}</strong>
        </div>
      )}

      {relations.length > 0 && (
        <div className="chart-hint-card__row">
          <span>Links</span>
          <strong>{relations.length}</strong>
        </div>
      )}

      {semantic.role && (
        <div className="chart-hint-card__row">
          <span>Role</span>
          <strong>{semantic.role}</strong>
        </div>
      )}

      {semantic.kind && (
        <div className="chart-hint-card__row">
          <span>Kind</span>
          <strong>{semantic.kind}</strong>
        </div>
      )}
    </div>
  )
}
