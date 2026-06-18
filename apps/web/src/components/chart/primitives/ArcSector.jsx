import { describeArcSector } from './svgGeometry'

export default function ArcSector({
  center,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill = 'currentColor',
  stroke = '#CCC',
  ...props
}) {
  return (
    <path
      {...props}
      d={describeArcSector({
        center,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle
      })}
      fill={fill}
      stroke={stroke}
    />
  )
}
