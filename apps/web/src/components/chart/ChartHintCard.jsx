import './ChartHintCard.css'

export default function ChartHintCard({
  node,
  chartModel,
  i18n,
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
        <span>{i18n.ui('lblNode')}</span>
        <strong>{node.id}</strong>
      </div>

      {node.entityId && (
        <div className="chart-hint-card__row">
          <span>{i18n.ui('lblEntity')}</span>
          <strong>{node.entityId}</strong>
        </div>
      )}

      {node.relationId && (
        <div className="chart-hint-card__row">
          <span>{i18n.ui('lblRelation')}</span>
          <strong>{node.relationId}</strong>
        </div>
      )}

      {relations.length > 0 && (
        <div className="chart-hint-card__row">
          <span>{i18n.ui('lblLinks')}</span>
          <strong>{relations.length}</strong>
        </div>
      )}

      {semantic.role && (
        <div className="chart-hint-card__row">
          <span>{i18n.ui('lblRole')}</span>
          <strong>{semantic.role}</strong>
        </div>
      )}

      {semantic.kind && (
        <div className="chart-hint-card__row">
          <span>{i18n.ui('lblKind')}</span>
          <strong>{semantic.kind}</strong>
        </div>
      )}
    </div>
  )
}
