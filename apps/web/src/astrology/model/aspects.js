// src/astrology/model/aspects.js

import { AspectType } from './enums'
import { getShortestAngularDistance } from './angle'

export const MAJOR_ASPECTS = Object.freeze([
  {
    type: AspectType.CONJUNCTION,
    angle: 0,
    orb: 8
  },
  {
    type: AspectType.SEXTILE,
    angle: 60,
    orb: 5
  },
  {
    type: AspectType.SQUARE,
    angle: 90,
    orb: 6
  },
  {
    type: AspectType.TRINE,
    angle: 120,
    orb: 6
  },
  {
    type: AspectType.OPPOSITION,
    angle: 180,
    orb: 8
  }
])

export function findAspectBetween(pointA, pointB) {
  const distance = getShortestAngularDistance(
    pointA.longitude,
    pointB.longitude
  )

  for (const aspectDefinition of MAJOR_ASPECTS) {
    const orb = Math.abs(distance - aspectDefinition.angle)

    if (orb <= aspectDefinition.orb) {
      return {
        id: `${pointA.id}_${pointB.id}_${aspectDefinition.type}`,
        type: aspectDefinition.type,
        pointAId: pointA.id,
        pointBId: pointB.id,
        exactAngle: aspectDefinition.angle,
        actualAngle: distance,
        orb
      }
    }
  }

  return null
}

export function createAspectModel(points) {
  const result = []
  const pointList = Object.values(points)

  for (let i = 0; i < pointList.length; i += 1) {
    for (let j = i + 1; j < pointList.length; j += 1) {
      const pointA = pointList[i]
      const pointB = pointList[j]

      if (pointA.type !== 'planet' || pointB.type !== 'planet') {
        continue
      }

      const aspect = findAspectBetween(pointA, pointB)

      if (aspect) {
        result.push(aspect)
      }
    }
  }

  return result
}