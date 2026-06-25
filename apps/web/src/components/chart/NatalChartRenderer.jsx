import './NatalChartRenderer.css'

import AspectLayer from './layers/AspectLayer'
import HouseLayer from './layers/HouseLayer'
import ZodiacLayer from './layers/ZodiacLayer'
import AngleLayer from './layers/AngleLayer'
import PointLayer from './layers/PointLayer'
import LayoutHandlesLayer from './layers/LayoutHandlesLayer'

/**
 * Semantic SVG renderer for a natal chart layout.
 * Each child layer owns one chart concept, so visual features like point halos
 * or zodiac animation are added in the relevant layer instead of a generic
 * shape dispatcher.
 */
export default function NatalChartRenderer({
  layout,
  i18n,
  animation,
  handlers,
  editor
}) {
  return (
    <svg
      className="natal-chart-renderer"
      width={layout.width}
      height={layout.height}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
    >
      <AspectLayer
        layout={layout}
        i18n={i18n}
        animation={animation}
        handlers={handlers}
      />
      <HouseLayer
        layout={layout}
        i18n={i18n}
        animation={animation}
        handlers={handlers}
      />
      <ZodiacLayer
        layout={layout}
        i18n={i18n}
        animation={animation}
        handlers={handlers}
      />
      <AngleLayer
        layout={layout}
        i18n={i18n}
        animation={animation}
        handlers={handlers}
      />
      <PointLayer
        layout={layout}
        i18n={i18n}
        animation={animation}
        handlers={handlers}
      />

      {editor && (
        <LayoutHandlesLayer
          layout={layout}
          houseRing={editor.houseRing}
          handlePositions={editor.handlePositions}
          onPointerDown={editor.onPointerDown}
          onPointerMove={editor.onPointerMove}
          onPointerUp={editor.onPointerUp}
        />
      )}
    </svg>
  )
}
