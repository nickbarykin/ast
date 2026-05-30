export default function WheelSector({
  x1,
  y1,
  x2,
  y2,
  stroke = 'white',
  strokeWidth = 1
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  )
}