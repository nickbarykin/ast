import { polarToCartesian } from '../../../astrology/geometry/polar'

function getPoint(center, radius, longitude, rotation) {
  return polarToCartesian(
    center,
    center,
    radius,
    longitude + rotation
  )
}

function AngleLine({
  center,
  radius,
  from,
  to,
  rotation,
  className
}) {
  const p1 = getPoint(center, radius, from.longitude, rotation)
  const p2 = getPoint(center, radius, to.longitude, rotation)

  return (
    <line
      className={className}
      x1={p1.x}
      y1={p1.y}
      x2={p2.x}
      y2={p2.y}
    />
  )
}

function AngleLabel({
  center,
  radius,
  angle,
  rotation
}) {
  const p = getPoint(center, radius, angle.longitude, rotation)

  return (
    <text
      x={p.x}
      y={p.y}
      textAnchor="middle"
      dominantBaseline="middle"
      className="angle-label"
    >
      {angle.abbreviation}
    </text>
  )
}

export default function AngleAxisLayer({
  center,
  radius,
  angles,
  rotation
}) {
  const { asc, dsc, mc, ic } = angles

  return (
    <g className="angle-axis-layer">
      <AngleLine
        center={center}
        radius={radius}
        from={asc}
        to={dsc}
        rotation={rotation}
        className="angle-axis angle-axis-horizon"
      />

      <AngleLine
        center={center}
        radius={radius}
        from={mc}
        to={ic}
        rotation={rotation}
        className="angle-axis angle-axis-meridian"
      />

      {[asc, dsc, mc, ic].map((angle) => (
        <AngleLabel
          key={angle.id}
          center={center}
          radius={radius + 18}
          angle={angle}
          rotation={rotation}
        />
      ))}
    </g>
  )
}