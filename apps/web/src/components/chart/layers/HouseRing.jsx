// HouseRing.jsx

import { polarToCartesian } from '../../../astrology/geometry/polar'

import WheelSector from '../primitives/WheelSector'

import { rotateAngle } from '../../../astrology/geometry/rotation'

export default function HouseRing({
  center,
  innerRadius,
  outerRadius,
  houses,
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
        stroke="rgba(255,255,255,0.5)"
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

      {houses.map((angle, index) => {

        const rotatedAngle =
            angle

        const p1 = polarToCartesian(
            center,
            center,
            innerRadius,
            rotatedAngle
        )

        const p2 = polarToCartesian(
            center,
            center,
            outerRadius,
            rotatedAngle
        )

        const next = houses[(index - 1 + houses.length) % houses.length]

        let middle =
            (angle + next) / 2

        // crossing 360°
        if (next < angle) {

            middle =
            (angle + next + 360) / 2

            if (middle >= 360) {
            middle -= 360
            }
        }

        const rotatedMiddle =
            rotateAngle(
            middle,
            rotation
            )

        const labelPos =
            polarToCartesian(
            center,
            center,
            (innerRadius + outerRadius) / 2,
            rotatedMiddle
            )

        return (
            <g key={index}>

            <WheelSector
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="white"
                strokeWidth="2"
            />

            <text
                x={labelPos.x}
                y={labelPos.y}
                fontSize="16"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
            >
                {((12 - index) % 12) + 1}
            </text>

            </g>
        )
        })}

    </g>
  )
}