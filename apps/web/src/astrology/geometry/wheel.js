export function rotateAngle(angle, rotation) {
  let result = angle - rotation + 180

  while (result < 0) {
    result += 360
  }

  while (result >= 360) {
    result -= 360
  }

  return result
}