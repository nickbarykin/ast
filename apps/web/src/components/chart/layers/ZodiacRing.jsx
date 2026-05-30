// ZodiacRing.jsx

import { polarToCartesian } from '../../../astrology/geometry/polar'

import { SIGNS } from '../../../astrology/constants/signs'

import WheelSector from '../primitives/WheelSector'

import { rotateAngle } from '../../../astrology/geometry/rotation'

export default function ZodiacRing({
  center,
  innerRadius,
  outerRadius,
  rotation
}) {

  return (
    <g>

      {/* outer circle */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
      />

      {/* inner circle */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />

      {/* zodiac sector lines */}
      {Array.from({ length: 12 }).map((_, index) => {

        const angle = rotateAngle(
            index * 30,
            rotation
        )

        const p1 = polarToCartesian(
          center,
          center,
          innerRadius,
          angle
        )

        const p2 = polarToCartesian(
          center,
          center,
          outerRadius,
          angle
        )

        return (
          <WheelSector
            key={index}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />
        )
      })}

      {/* zodiac symbols */}
      {SIGNS.map((sign, index) => {

        const angle = rotateAngle(
            index * 30 + 15,
            rotation
        )

        const pos = polarToCartesian(
          center,
          center,
          outerRadius - 28,
          angle
        )

        return (
          <text
            key={sign.id}
            x={pos.x}
            y={pos.y}
            fontSize="24"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
          >
            {sign.emoji}
          </text>
        )
      })}

    </g>
  )
}