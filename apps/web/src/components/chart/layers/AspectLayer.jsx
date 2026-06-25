import { getAnimationProps } from '../animation/chartAnimations'
import { createLayerNode, getInteractionProps } from './layerEvents'

function createAnchorMap(points) {
  return Object.fromEntries(
    points.map((item) => [item.entity.id, item.anchorPosition])
  )
}

/**
 * Renders aspect lines between point anchors inside the house ring.
 * Aspect geometry intentionally depends on PointLayer layout, not raw points.
 */
export default function AspectLayer({ layout, i18n, animation, handlers }) {
  const anchorByPointId = createAnchorMap(layout.points)

  return (
    <g data-layer-id="aspects">
      {layout.aspects.map((item) => {
        const aspect = item.entity
        const source = anchorByPointId[aspect.pointAId]
        const target = anchorByPointId[aspect.pointBId]

        if (!source || !target) {
          return null
        }

        const node = createLayerNode({
          id: `node:${aspect.id}`,
          entityId: aspect.id,
          relationId: aspect.id,
          role: 'aspect-line',
          kind: 'aspect',
          label: i18n.message('aspectLabel', {
            pointAId: aspect.pointAId,
            aspectType: aspect.aspectType,
            pointBId: aspect.pointBId
          }),
          data: {
            ringId: item.ringId,
            aspectType: aspect.aspectType,
            pointAId: aspect.pointAId,
            pointBId: aspect.pointBId
          }
        })

        return (
          <line
            key={aspect.id}
            {...getAnimationProps(animation, 'aspect', 'chart-aspect-line')}
            {...getInteractionProps(node, handlers)}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={layout.styles[item.styleId]?.color}
            opacity={layout.styles[item.styleId]?.opacity}
          />
        )
      })}
    </g>
  )
}
