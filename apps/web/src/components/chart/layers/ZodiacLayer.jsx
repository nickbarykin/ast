import ArcSector from '../primitives/ArcSector'
import Glyph from '../primitives/Glyph'
import { SIGN_GLYPHS } from '../chartGlyphs'
import { createLayerNode, getInteractionProps } from './layerEvents'
import { getAnimationProps } from '../animation/chartAnimations'

/**
 * Renders zodiac sectors and sign glyphs from layout.signs.
 * This layer owns zodiac visuals only; ring sizing comes from layout/rings.
 */
export default function ZodiacLayer({ layout, i18n, animation, handlers }) {
  return (
    <g data-layer-id="zodiac">
      {layout.signs.map((item) => {
        const sign = item.entity
        const node = createLayerNode({
          id: `node:${sign.entityId}`,
          entityId: sign.entityId,
          role: 'zodiac-sector',
          kind: 'sign',
          label: i18n.sign(sign.id),
          data: { ringId: item.ringId }
        })

        return (
          <g key={sign.entityId} {...getInteractionProps(node, handlers)}>
            <ArcSector
              {...getAnimationProps(animation, 'zodiacSector', 'chart-zodiac-sector')}
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
              {...getAnimationProps(animation, 'zodiacGlyph', 'chart-zodiac-glyph')}
              x={item.labelPosition.x}
              y={item.labelPosition.y}
              size="22"
              fill={layout.styles[item.labelStyleId]?.color}
              opacity={layout.styles[item.labelStyleId]?.opacity}
            >
              {SIGN_GLYPHS[sign.id] ?? sign.id}
            </Glyph>
          </g>
        )
      })}
    </g>
  )
}
