import { normalizeChart } from '../../astrology/transform/normalizeChart'

import ZodiacRing from './layers/ZodiacRing'
import HouseRing from './layers/HouseRing'
import PlanetLayer from './layers/PlanetLayer'
import AspectLayer from './layers/AspectLayer'
import AngleAxisLayer from './layers/AngleAxisLayer'

export default function NatalChart({ chart }) {
  const normalized = normalizeChart(chart)

  const size = 800
  const center = size / 2

  const rotation = 90 - chart.houses.ascendant

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        background: '#111'
      }}
    >
      <ZodiacRing
        center={center}
        innerRadius={300}
        outerRadius={360}
        rotation={rotation}
      />

      <HouseRing
        center={center}
        innerRadius={180}
        outerRadius={260}
        houses={normalized.houses}
      />

      <AngleAxisLayer
        center={center}
        radius={300}
        angles={normalized.angles}
        rotation={rotation}
      />

      <AspectLayer
        center={center}
        radius={160}
        planets={Object.values(normalized.points)}
        rotation={rotation}
      />

      <PlanetLayer
        center={center}
        radius={230}
        planets={Object.values(normalized.points)}
        rotation={rotation}
      />
    </svg>
  )
}