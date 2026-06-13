// PlanetLayer.jsx

import { polarToCartesian } from '../../../astrology/geometry/polar'
import { PLANETS } from '../../../astrology/constants/planets'
import { rotateAngle } from '../../../astrology/geometry/rotation'

export default function PlanetLayer({
  center,
  radius,
  planets,
  rotation
}) {

  return (
    <g>

      {/* orbit ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />

      {planets.map((planet) => {

        const angle = rotateAngle(
            planet.longitude,
            rotation
        )

        const pos = polarToCartesian(
          center,
          center,
          radius,
          angle
        )

        const meta = PLANETS[planet.key]

        return (
          <g key={planet.id}>

            {/* helper line */}
            <line
              x1={center}
              y1={center}
              x2={pos.x}
              y2={pos.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />

            {/* planet dot */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="14"
              fill="#1e1e1e"
              stroke="white"
              strokeWidth="1.5"
            />

            {/* glyph */}
            <text
              x={pos.x}
              y={pos.y + 1}
              fontSize="18"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
            >
              {meta?.emoji ?? '?'}
            </text>

          </g>
        )
      })}

    </g>
  )
}