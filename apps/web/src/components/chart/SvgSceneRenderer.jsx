import { SHAPE_TYPE } from '../../astrology/scene/sceneModel';


function getAllNodes(scene) {
  return scene.layers.flatMap(layer => layer.nodes);
}

function findNode(scene, nodeId) {
  for (const layer of scene.layers) {
    const node = layer.nodes.find(node => node.id === nodeId);

    if (node) {
      return node;
    }
  }

  return null;
}

function getNodePoint(node) {
  const shape = node.shape;

  if (shape.type === SHAPE_TYPE.GLYPH) {
    return {
      x: shape.x,
      y: shape.y
    };
  }

  if (shape.type === SHAPE_TYPE.CIRCLE) {
    return {
      x: shape.x,
      y: shape.y
    };
  }

  return null;
}

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360
}

function getClockwiseDelta(startAngle, endAngle) {
  return normalizeAngle(endAngle - startAngle)
}

function describeArcSector(shape) {
  const { center, innerRadius, outerRadius, startAngle, endAngle } = shape

  const end = -normalizeAngle(startAngle) 
  const start = -normalizeAngle(endAngle) 

  const delta = normalizeAngle(start - end)
  const largeArcFlag = delta > 180 ? 1 : 0

  const startOuter = polarToCartesian(center.x, center.y, outerRadius, start)
  const endOuter = polarToCartesian(center.x, center.y, outerRadius, end)
  const startInner = polarToCartesian(center.x, center.y, innerRadius, start)
  const endInner = polarToCartesian(center.x, center.y, innerRadius, end)

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    'Z'
  ].join(' ')
}

function polarToCartesian(centerX, centerY, radius, angle) {
  const radians = (angle - 90) * Math.PI / 180;

  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians)
  };
}

function getSvgNodeProps(node) {
  const label = node.semantic?.label ?? node.entityId ?? node.id
  const role = node.semantic?.role ?? node.shape.type

  return {
    id: node.id.replaceAll(':', '__'),
    'data-node-id': node.id,
    'data-entity-id': node.entityId ?? '',
    'data-relation-id': node.relationId ?? '',
    'data-layer-id': node.layerId ?? '',
    'data-role': role,
    'data-label': label
  }
}

function getInteractionProps(node, handlers) {
  return {
    onMouseEnter: (event) => handlers.onNodeEnter?.(node, event),
    onMouseMove: (event) => handlers.onNodeMove?.(node, event),
    onMouseLeave: (event) => handlers.onNodeLeave?.(node, event)
  }
}

function renderNode(node, scene, handlers) {
  if (!node.visible) {
    return null;
  }

  const shape = node.shape;
  const opacity = node.state?.opacity ?? 1;

  if (shape.type === SHAPE_TYPE.ARC) {
    return (
      <path
        key={node.id}
        {...getSvgNodeProps(node)}
        {...getInteractionProps(node, handlers)}
        d={describeArcSector(shape)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity={opacity}
      >
        <title>{node.semantic?.label ?? node.id}</title>
      </path>
    );
  }

  if (shape.type === SHAPE_TYPE.GLYPH) {
    return (
      <text
        key={node.id}
        {...getSvgNodeProps(node)}
        {...getInteractionProps(node, handlers)}
        x={shape.x}
        y={shape.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={shape.size}
        opacity={opacity}
      >
        {shape.glyphId}
      </text>
    );
  }

  if (shape.type === SHAPE_TYPE.RELATION_LINE) {
    const sourceNode = findNode(scene, shape.sourceNodeId);
    const targetNode = findNode(scene, shape.targetNodeId);

    if (!sourceNode || !targetNode) {
      return null;
    }

    const source = getNodePoint(sourceNode);
    const target = getNodePoint(targetNode);

    if (!source || !target) {
      return null;
    }

    return (
      <line
        key={node.id}
        {...getSvgNodeProps(node)}
        {...getInteractionProps(node, handlers)}
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        stroke="currentColor"
        strokeWidth="1"
        opacity={0.35}
      />
    );
  }

  if (shape.type === SHAPE_TYPE.CIRCLE) {
    return (
      <circle
        key={node.id}
        {...getSvgNodeProps(node)}
        {...getInteractionProps(node, handlers)}
        cx={shape.x}
        cy={shape.y}
        r={shape.radius}
        fill="currentColor"
        opacity={opacity}
      >
        <title>{node.semantic?.label ?? node.id}</title>
      </circle>
    )
  }

  return null;
}

export default function SvgSceneRenderer({
  scene,
  onNodeEnter,
  onNodeMove,
  onNodeLeave
}) {
  if (!scene) {
    return null;
  }

  return (
    <svg
      width={scene.width}
      height={scene.height}
      viewBox={`0 0 ${scene.width} ${scene.height}`}
    >
      <circle
        cx={scene.center.x}
        cy={scene.center.y}
        r="300"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      <circle
        cx={scene.center.x}
        cy={scene.center.y}
        r="260"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      {scene.layers.map(layer => {
        if (!layer.visible) {
          return null;
        }

        return (
          <g key={layer.id}>
            {layer.nodes.map((node) =>
              renderNode(node, scene, {
                onNodeEnter,
                onNodeMove,
                onNodeLeave
              })
            )}
          </g>
        );
      })}
    </svg>
  );
}