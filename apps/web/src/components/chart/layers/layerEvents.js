export function createLayerNode({
  id,
  entityId,
  relationId = null,
  role,
  kind,
  label,
  data = {}
}) {
  return {
    id,
    entityId,
    relationId,
    semantic: {
      role,
      kind,
      label,
      ...data
    }
  }
}

export function getInteractionProps(node, handlers) {
  return {
    onMouseEnter: (event) => handlers.onNodeEnter?.(node, event),
    onMouseMove: (event) => handlers.onNodeMove?.(node, event),
    onMouseLeave: (event) => handlers.onNodeLeave?.(node, event),
    onClick: (event) => handlers.onNodeClick?.(node, event)
  }
}
