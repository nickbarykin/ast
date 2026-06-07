export function findLayer(scene, layerId) {
  return scene.layers.find(layer => layer.id === layerId) || null;
}

export function findNode(scene, nodeId) {
  for (const layer of scene.layers) {
    const node = layer.nodes.find(node => node.id === nodeId);

    if (node) {
      return node;
    }
  }

  return null;
}

export function findNodesByEntityId(scene, entityId) {
  return scene.layers.flatMap(layer =>
    layer.nodes.filter(node => node.entityId === entityId)
  );
}

export function findNodesByEntityIds(scene, entityIds) {
  const ids = new Set(entityIds);

  return scene.layers.flatMap(layer =>
    layer.nodes.filter(node => ids.has(node.entityId))
  );
}

export function setSceneTransform(scene, transform) {
  scene.transform = {
    ...scene.transform,
    ...transform
  };

  return scene;
}

export function setLayerVisibility(scene, layerId, visible) {
  const layer = findLayer(scene, layerId);

  if (layer) {
    layer.visible = visible;
  }

  return scene;
}

export function setLayerTransform(scene, layerId, transform) {
  const layer = findLayer(scene, layerId);

  if (layer) {
    layer.transform = {
      ...layer.transform,
      ...transform
    };
  }

  return scene;
}

export function setNodeVisibility(scene, nodeId, visible) {
  const node = findNode(scene, nodeId);

  if (node) {
    node.visible = visible;
  }

  return scene;
}

export function setNodeState(scene, nodeId, state) {
  const node = findNode(scene, nodeId);

  if (node) {
    node.state = {
      ...node.state,
      ...state
    };
  }

  return scene;
}

export function setNodesStateByEntityIds(scene, entityIds, state) {
  const nodes = findNodesByEntityIds(scene, entityIds);

  nodes.forEach(node => {
    node.state = {
      ...node.state,
      ...state
    };
  });

  return scene;
}

export function resetNodeStates(scene) {
  scene.layers.forEach(layer => {
    layer.nodes.forEach(node => {
      node.state.selected = false;
      node.state.highlighted = false;
      node.state.disabled = false;
      node.state.opacity = 1;
      node.state.emphasis = 'normal';
    });
  });

  return scene;
}