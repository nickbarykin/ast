import { SHAPE_TYPE } from './sceneModel';

export function circleShape({ x, y, radius }) {
  return {
    type: SHAPE_TYPE.CIRCLE,
    x,
    y,
    radius
  };
}

export function lineShape({ x1, y1, x2, y2 }) {
  return {
    type: SHAPE_TYPE.LINE,
    x1,
    y1,
    x2,
    y2
  };
}

export function arcShape({
  center,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle
}) {
  return {
    type: SHAPE_TYPE.ARC,
    center,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle
  };
}

export function textShape({
  text,
  x,
  y,
  fontSize = 12,
  align = 'center'
}) {
  return {
    type: SHAPE_TYPE.TEXT,
    text,
    x,
    y,
    fontSize,
    align
  };
}

export function glyphShape({
  glyphId,
  x,
  y,
  size = 16
}) {
  return {
    type: SHAPE_TYPE.GLYPH,
    glyphId,
    x,
    y,
    size
  };
}

export function relationLineShape({
  sourceNodeId,
  targetNodeId
}) {
  return {
    type: SHAPE_TYPE.RELATION_LINE,
    sourceNodeId,
    targetNodeId
  };
}