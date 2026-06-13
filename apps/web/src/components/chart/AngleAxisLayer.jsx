import { polarToCartesian } from '../../astrology/geometry/polar';
import { longitudeToChartAngle } from '../../astrology/geometry/wheel';

export default function AngleAxisLayer({
  chart,
  center,
  radius,
  labelRadius
}) {
  const { asc, dsc, mc, ic } = chart.angles;

  return (
    <g className="angle-axis-layer">
      <AngleAxis
        chart={chart}
        center={center}
        radius={radius}
        from={asc}
        to={dsc}
      />

      <AngleAxis
        chart={chart}
        center={center}
        radius={radius}
        from={mc}
        to={ic}
      />

      {[asc, dsc, mc, ic].map((angle) => (
        <AngleLabel
          key={angle.id}
          chart={chart}
          center={center}
          radius={labelRadius}
          angle={angle}
        />
      ))}
    </g>
  );
}

function AngleAxis({ chart, center, radius, from, to }) {
  const p1 = polarToCartesian(
    center.x,
    center.y,
    radius,
    longitudeToChartAngle(from.longitude, chart)
  );

  const p2 = polarToCartesian(
    center.x,
    center.y,
    radius,
    longitudeToChartAngle(to.longitude, chart)
  );

  return (
    <line
      className={`angle-axis angle-axis-${from.axis}`}
      x1={p1.x}
      y1={p1.y}
      x2={p2.x}
      y2={p2.y}
    />
  );
}

function AngleLabel({ chart, center, radius, angle }) {
  const p = polarToCartesian(
    center.x,
    center.y,
    radius,
    longitudeToChartAngle(angle.longitude, chart)
  );

  return (
    <text
      className="angle-label"
      x={p.x}
      y={p.y}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {angle.abbreviation}
    </text>
  );
}