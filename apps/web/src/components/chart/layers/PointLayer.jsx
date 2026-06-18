import Glyph from '../primitives/Glyph'
import { POINT_GLYPHS } from '../chartGlyphs'
import { createLayerNode, getInteractionProps } from './layerEvents'
import { getAnimationProps } from '../animation/chartAnimations'

function getHaloRadius(point) {
  if (point.pointType === 'planet') {
    return 14
  }

  return 12
}

/**
 * Renders every chart point placed on the house ring: planets, calculated
 * points, sensitive points, and hypothetical points like Proserpina.
 */
export default function PointLayer({ layout, animation, handlers }) {
  return (
    <g data-layer-id="points">
      {layout.points.map((item) => {
        const point = item.entity
        const node = createLayerNode({
          id: `node:${point.entityId}`,
          entityId: point.entityId,
          role: 'chart-point',
          kind: point.pointType,
          label: point.id,
          data: {
            ringId: item.ringId,
            laneIndex: item.laneIndex,
            longitude: point.longitude
          }
        })

        return (
          <g
            key={point.entityId}
            className="chart-point"
            data-point-type={point.pointType}
            {...getInteractionProps(node, handlers)}
          >
            <circle
              {...getAnimationProps(animation, 'pointHalo', 'chart-point__halo')}
              cx={item.position.x}
              cy={item.position.y}
              r={getHaloRadius(point)}
              fill="none"
              stroke={layout.styles[item.styleId]?.color}
              opacity="0.55"
            />

            <Glyph
              {...getAnimationProps(animation, 'point', 'chart-point__glyph')}
              x={item.position.x}
              y={item.position.y}
              size={point.pointType === 'planet' ? 20 : 14}
              fill={layout.styles[item.styleId]?.color}
              opacity={layout.styles[item.styleId]?.opacity}
            >
              {POINT_GLYPHS[point.id] ?? point.id}
            </Glyph>
          </g>
        )
      })}
    </g>
  )
}
