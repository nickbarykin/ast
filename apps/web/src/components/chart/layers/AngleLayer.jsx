import Glyph from '../primitives/Glyph'
import { POINT_GLYPHS } from '../chartGlyphs'
import { createLayerNode, getInteractionProps } from './layerEvents'
import { getAnimationProps } from '../animation/chartAnimations'

/**
 * Renders ASC/DSC and MC/IC axes plus labels outside the zodiac ring.
 * The actual offset from the zodiac ring is controlled by layout/rings.
 */
export default function AngleLayer({
  layout,
  i18n,
  animation,
  handlers,
  selectedEntityId
}) {
  return (
    <g data-layer-id="angles">
      {layout.angles.axes.map((item) => {
        const node = createLayerNode({
          id: `node:angle-axis:${item.from.id}:${item.to.id}`,
          entityId: item.from.entityId,
          role: 'angle-axis',
          kind: 'angle-axis',
          label: i18n.message('angleAxisLabel', {
            fromId: item.from.id,
            toId: item.to.id
          }),
          data: { ringId: item.ringId }
        })

        return (
          <line
            key={node.id}
            {...getAnimationProps(animation, 'angleAxis', 'chart-angle-axis')}
            {...getInteractionProps(node, handlers)}
            x1={item.fromPosition.x}
            y1={item.fromPosition.y}
            x2={item.toPosition.x}
            y2={item.toPosition.y}
            stroke={layout.styles[item.styleId]?.color}
            opacity={layout.styles[item.styleId]?.opacity}
          />
        )
      })}

      {layout.angles.labels.map((item) => {
        const angle = item.entity
        const isSelected = selectedEntityId === angle.entityId
        const node = createLayerNode({
          id: `node:angle-label:${angle.id}`,
          entityId: angle.entityId,
          role: 'angle-label',
          kind: 'angle',
          label: i18n.point(angle.id),
          data: { ringId: item.ringId }
        })

        return (
          <Glyph
            key={node.id}
            {...getAnimationProps(
              animation,
              'angleLabel',
              `chart-angle-label${isSelected ? ' chart-angle-label--selected' : ''}`
            )}
            {...getInteractionProps(node, handlers)}
            x={item.position.x}
            y={item.position.y}
            size="12"
            fill={layout.styles[item.styleId]?.color}
            opacity={layout.styles[item.styleId]?.opacity}
          >
            {POINT_GLYPHS[angle.id] ?? angle.id}
          </Glyph>
        )
      })}
    </g>
  )
}
