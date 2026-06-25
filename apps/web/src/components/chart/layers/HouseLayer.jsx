import ArcSector from '../primitives/ArcSector'
import Glyph from '../primitives/Glyph'
import { createLayerNode, getInteractionProps } from './layerEvents'
import { getAnimationProps } from '../animation/chartAnimations'

/**
 * Renders astrological houses as sectors plus house number labels.
 * Point placement depends on this same house ring, but remains in PointLayer.
 */
export default function HouseLayer({
  layout,
  i18n,
  animation,
  handlers,
  selectedEntityId
}) {
  return (
    <g data-layer-id="houses">
      {layout.houses.map((item) => {
        const house = item.entity
        const node = createLayerNode({
          id: `node:${house.entityId}`,
          entityId: house.entityId,
          role: 'house-sector',
          kind: 'house',
          label: i18n.message('houseLabel', { number: house.number }),
          data: { ringId: item.ringId, number: house.number }
        })
        const isSelected = selectedEntityId === house.entityId

        return (
          <g
            key={house.entityId}
            className={isSelected ? 'chart-house--selected' : undefined}
            data-house-id={house.id}
            {...getInteractionProps(node, handlers)}
          >
            <ArcSector
              {...getAnimationProps(
                animation,
                'houseSector',
                `chart-house-sector${isSelected ? ' chart-house-sector--selected' : ''}`
              )}
              center={layout.center}
              innerRadius={item.innerRadius}
              outerRadius={item.outerRadius}
              startAngle={item.startAngle}
              endAngle={item.endAngle}
              fill={layout.styles[item.styleId]?.color}
              fillOpacity={layout.styles[item.styleId]?.fillOpacity}
              opacity={layout.styles[item.styleId]?.opacity}
            />

            <Glyph
              {...getAnimationProps(animation, 'houseLabel', 'chart-house-label')}
              x={item.labelPosition.x}
              y={item.labelPosition.y}
              size="12"
              fill={layout.styles[item.labelStyleId]?.color}
              opacity={layout.styles[item.labelStyleId]?.opacity}
            >
              {house.number}
            </Glyph>
          </g>
        )
      })}
    </g>
  )
}
