export default function Glyph({
  x,
  y,
  size,
  children,
  ...props
}) {
  return (
    <text
      {...props}
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={size}
    >
      {children}
    </text>
  )
}
