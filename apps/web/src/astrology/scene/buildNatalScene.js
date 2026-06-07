import {
  createScene,
  createLayer,
  createSceneNode
} from './sceneModel'

import {
  arcShape,
  circleShape,
  glyphShape,
  relationLineShape
} from './shapes'

import { getRotationForLongitudeAtScreenAngle } from './sceneRotation'
import { polarToCartesian } from '../geometry/polar'
import { layoutPlanetLanes } from './layout/planetLanes'

const SIGN_GLYPHS = {
  aries: '♈',
  taurus: '♉',
  gemini: '♊',
  cancer: '♋',
  leo: '♌',
  virgo: '♍',
  libra: '♎',
  scorpio: '♏',
  sagittarius: '♐',
  capricorn: '♑',
  aquarius: '♒',
  pisces: '♓'
}

const LAYER_ID = {
  ZODIAC: 'layer:zodiac',
  ZODIAC_LABELS: 'layer:zodiac-labels',
  HOUSES: 'layer:houses',
  HOUSE_LABELS: 'layer:house-labels',
  POINT_ANCHORS: 'layer:point-anchors',
  ASPECTS: 'layer:aspects',
  POINTS: 'layer:points'
}

const POINT_GLYPHS = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',

  chiron: '⚷',

  northNodeMean: '☊',
  southNodeMean: '☋',
  northNodeTrue: '☊',
  southNodeTrue: '☋',

  lilithMean: '⚸',
  lilithOsculating: '⚸',

  ascendant: 'ASC',
  descendant: 'DSC',
  mc: 'MC',
  ic: 'IC',
  vertex: 'Vx'
}

function longitudeToScreenAngle(longitude, rotation = 0) {
  return longitude + rotation
}

export function buildNatalScene(chart, options = {}) {
  const width = options.width ?? 600
  const height = options.height ?? 600

  const center = {
    x: width / 2,
    y: height / 2
  }

  const ascendant = chart.points.ascendant

  const rotation = getRotationForLongitudeAtScreenAngle(
    ascendant.longitude,
    90
  )

  const scene = createScene({
    id: 'scene:natal',
    width,
    height,
    center,
    layers: []
  })

  const housesLayer = createLayer({
    id: LAYER_ID.HOUSES,
    name: 'Houses'
  })

  const aspectsLayer = createLayer({
    id: LAYER_ID.ASPECTS,
    name: 'Aspects'
  })

  const pointsLayer = createLayer({
    id: LAYER_ID.POINTS,
    name: 'Points'
  })

  const zodiacLayer = createLayer({
    id: LAYER_ID.ZODIAC,
    name: 'Zodiac'
  })

  const pointAnchorsLayer = createLayer({
    id: LAYER_ID.POINT_ANCHORS,
    name: 'Point Anchors'
  })

  const zodiacLabelsLayer = createLayer({
    id: LAYER_ID.ZODIAC_LABELS,
    name: 'Zodiac Labels'
  })

  const houseLabelsLayer = createLayer({
    id: LAYER_ID.HOUSE_LABELS,
    name: 'House Labels'
  })

  chart.houses.forEach((house) => {
    housesLayer.nodes.push(
      createSceneNode({
        id: `node:${house.entityId}`,
        entityId: house.entityId,
        layerId: LAYER_ID.HOUSES,
        semantic: {
            role: 'house-sector',
            label: `House ${house.number}`,
            kind: 'house',
            number: house.number
        },
        shape: arcShape({
            center,
            innerRadius: 180,
            outerRadius: 260,
            startAngle: longitudeToScreenAngle(house.cuspLongitude, rotation),
            endAngle: longitudeToScreenAngle(house.nextCuspLongitude, rotation)
        })
      })
    )

    const houseMiddleLongitude = house.cuspLongitude + house.size / 2
    const houseLabelAngle = longitudeToScreenAngle(houseMiddleLongitude, rotation)
    const houseLabelPosition = polarToCartesian(center.x, center.y, 220, houseLabelAngle)

    houseLabelsLayer.nodes.push(
      createSceneNode({
        id: `node:${house.entityId}:label`,
        entityId: house.entityId,
        layerId: LAYER_ID.HOUSE_LABELS,
        semantic: {
          role: 'house-number',
          label: `House ${house.number}`,
          kind: 'house-label',
          number: house.number
        },
        shape: glyphShape({
          glyphId: String(house.number),
          x: houseLabelPosition.x,
          y: houseLabelPosition.y,
          size: 12
        })
      })
    )
  })

  const visualPoints = Object.values(chart.points)
    .map((point) => {
      const angle = longitudeToScreenAngle(point.longitude, rotation)

      return {
        ...point,
        screenAngle: angle
      }
    })

  const laidOutPoints = layoutPlanetLanes(visualPoints, {
    innerRadius: 180,
    outerRadius: 260,
    minAngleDistance: 8,
    maxLaneCount: 4
  })

  laidOutPoints.forEach((point) => {
    const anchorPosition = polarToCartesian(
      center.x,
      center.y,
      170,
      point.screenAngle
    )

    pointAnchorsLayer.nodes.push(
      createSceneNode({
        id: `node:anchor:${point.entityId}`,
        entityId: point.entityId,
        layerId: LAYER_ID.POINT_ANCHORS,
        interactive: false,
        semantic: {
          role: 'point-anchor',
          label: `${point.id} anchor`,
          kind: point.pointType,
          longitude: point.longitude
        },
        shape: circleShape({
          x: anchorPosition.x,
          y: anchorPosition.y,
          radius: 2
        })
      })
    )

    const position = polarToCartesian(
      center.x,
      center.y,
      point.radius,
      point.screenAngle
    )

    pointsLayer.nodes.push(
      createSceneNode({
        id: `node:${point.entityId}`,
        entityId: point.entityId,
        layerId: LAYER_ID.POINTS,
        semantic: {
          role: 'chart-point',
          label: point.id,
          kind: point.pointType,
          longitude: point.longitude,
          laneIndex: point.laneIndex,
          radius: point.radius
        },
        shape: glyphShape({
          glyphId: POINT_GLYPHS[point.id] ?? point.id,
          x: position.x,
          y: position.y,
          size: point.pointType === 'angle' ? 12 : 20
        })
      })
    )
  })

  chart.aspects.forEach((aspect) => {
    aspectsLayer.nodes.push(
      createSceneNode({
        id: `node:${aspect.id}`,
        entityId: aspect.id,
        relationId: aspect.id,
        layerId: LAYER_ID.ASPECTS,
        semantic: {
          role: 'aspect-line',
          label: `${aspect.pointAId} ${aspect.aspectType} ${aspect.pointBId}`,
          kind: 'aspect',
          aspectType: aspect.aspectType,
          pointAId: aspect.pointAId,
          pointBId: aspect.pointBId
        },
        shape: relationLineShape({
          sourceNodeId: `node:anchor:point:${aspect.pointAId}`,
          targetNodeId: `node:anchor:point:${aspect.pointBId}`
        })
      })
    )
  })

  chart.signs.forEach((sign) => {
    const middleLongitude = sign.startLongitude + 15
    const angle = longitudeToScreenAngle(middleLongitude, rotation)
    const position = polarToCartesian(center.x, center.y, 280, angle)

    zodiacLayer.nodes.push(
      createSceneNode({
        id: `node:${sign.entityId}`,
        entityId: sign.entityId,
        layerId: LAYER_ID.ZODIAC,
        semantic: {
          role: 'zodiac-sector',
          label: sign.id,
          kind: 'sign'
        },
        shape: arcShape({
            center,
            innerRadius: 260,
            outerRadius: 300,
            startAngle: longitudeToScreenAngle(sign.startLongitude , rotation),
            endAngle: longitudeToScreenAngle(sign.endLongitude, rotation)
        })
      })
    )

    zodiacLabelsLayer.nodes.push(
      createSceneNode({
        id: `node:${sign.entityId}:glyph`,
        entityId: sign.entityId,
        layerId: LAYER_ID.ZODIAC_LABELS,
        semantic: {
          role: 'zodiac-sign-glyph',
          label: sign.id,
          kind: 'sign'
        },
        shape: glyphShape({
          glyphId: SIGN_GLYPHS[sign.id] ?? sign.id,
          x: position.x,
          y: position.y,
          size: 22
        })
      })
    )
  })

  scene.layers.push(
    zodiacLabelsLayer,
    zodiacLayer,
    housesLayer,
    houseLabelsLayer,
    pointAnchorsLayer,
    aspectsLayer,
    pointsLayer
  )

  return scene
}