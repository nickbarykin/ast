export const SHAPE_TYPE = {
  CIRCLE: 'circle',
  LINE: 'line',
  ARC: 'arc',
  TEXT: 'text',
  GLYPH: 'glyph',
  RELATION_LINE: 'relationLine'
};

export function createTransform(overrides = {}) {
  return {
    rotate: 0,
    scale: 1,
    translateX: 0,
    translateY: 0,
    ...overrides
  };
}

export function createNodeState(overrides = {}) {
  return {
    opacity: 1,
    selected: false,
    highlighted: false,
    disabled: false,
    emphasis: 'normal',
    ...overrides
  };
}

export function createScene({
  id = 'scene:natal',
  width = 600,
  height = 600,
  center = { x: width / 2, y: height / 2 },
  transform = {},
  layers = []
} = {}) {
  return {
    id,
    width,
    height,
    center,
    transform: createTransform(transform),
    layers
  };
}

export function createLayer({
  id,
  name = id,
  visible = true,
  transform = {},
  nodes = []
}) {
  return {
    id,
    name,
    visible,
    transform: createTransform(transform),
    nodes
  };
}

export function createSceneNode({
  id,
  entityId = null,
  relationId = null,
  layerId = null,
  visible = true,
  interactive = true,
  transform = {},
  state = {},
  semantic = {},
  shape
}) {
  return {
    id,
    entityId,
    relationId,
    layerId,
    visible,
    interactive,
    transform: createTransform(transform),
    state: createNodeState(state),
    semantic,
    shape
  }
}