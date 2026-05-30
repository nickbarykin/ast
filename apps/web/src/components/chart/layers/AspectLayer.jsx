import { polarToCartesian }
  from '../../../astrology/geometry/polar'

import { rotateAngle } from '../../../astrology/geometry/rotation'

const ASPECTS = [
  { angle: 0, orb: 8, color: '#ffffff' },
  { angle: 60, orb: 4, color: '#66ccff' },
  { angle: 90, orb: 6, color: '#ff6666' },
  { angle: 120, orb: 6, color: '#66ff99' },
  { angle: 180, orb: 8, color: '#ff4444' }
]

function getAngleDiff(a, b) {

  let diff = Math.abs(a - b)

  if (diff > 180) {
    diff = 360 - diff
  }

  return diff
}

function findAspect(diff) {

  return ASPECTS.find((aspect) => {
    return Math.abs(diff - aspect.angle)
      <= aspect.orb
  })
}

export default function AspectLayer({
  center,
  radius,
  planets,
  rotation
}) {

  const lines = []

  for (let i = 0; i < planets.length; i++) {

    for (let j = i + 1; j < planets.length; j++) {

      const p1 = planets[i]
      const p2 = planets[j]

      const diff = getAngleDiff(
        p1.longitude,
        p2.longitude
      )

      const aspect = findAspect(diff)

      if (!aspect) {
        continue
      }

      const pos1 = polarToCartesian(
        center,
        center,
        radius,
        rotateAngle(
          p1.longitude,
          rotation
        )
      )

      const pos2 = polarToCartesian(
        center,
        center,
        radius,
        rotateAngle(
          p2.longitude,
          rotation
        )
      )

      lines.push(
        <line
          key={`${p1.id}-${p2.id}`}
          x1={pos1.x}
          y1={pos1.y}
          x2={pos2.x}
          y2={pos2.y}
          stroke={aspect.color}
          strokeWidth="1.5"
          opacity="0.8"
        />
      )
    }
  }

  return <g>{lines}</g>
}