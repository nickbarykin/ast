export function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

export function getRotationForLongitudeAtScreenAngle(longitude, screenAngle) {
  return normalizeAngle(screenAngle - longitude);
}