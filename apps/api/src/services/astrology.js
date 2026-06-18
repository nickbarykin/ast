// astrology.js

const swe = require('swisseph')
const path = require('path')

swe.swe_set_ephe_path(
  path.resolve(__dirname, '../../ephe')
)

const { DateTime } = require('luxon')
const POINTS = require('../constants/points')
const {
  calculateAvestanGlobaProserpina
} = require('./proserpina')


function toJulianDay({ date, time, timezone }) {

  const dt = DateTime
    .fromISO(`${date}T${time}`, {
      zone: timezone
    })
    .toUTC()

  return swe.swe_julday(
    dt.year,
    dt.month,
    dt.day,
    dt.hour + dt.minute / 60,
    swe.SE_GREG_CAL
  )
}

function calcPoint(jd, pointId) {
  return new Promise((resolve, reject) => {
    swe.swe_calc_ut(
      jd,
      pointId,
      swe.SEFLG_SWIEPH | swe.SEFLG_SPEED,
      (...args) => {
        if (!args || !args.length) {
          reject(new Error('Empty swiss response'))
          return
        }

        resolve(args[0])
      }
    )
  })
}

function normalizeLongitude(longitude) {
  return ((longitude % 360) + 360) % 360
}

function createOppositePoint(point) {
  return {
    ...point,
    longitude: normalizeLongitude(point.longitude + 180),
    speed: point.speed == null ? point.speed : -point.speed
  }
}

function calcHouses(jd, lat, lon) {

  return new Promise((resolve) => {

    swe.swe_houses(
      jd,
      lat,
      lon,
      'P',
      (result) => {
        resolve(result)
      }
    )
  })
}

async function buildChart(data) {

  const jd = toJulianDay(data)

  const points = {}

  for (const [id, pointConfig] of Object.entries(POINTS)) {
    const result = await calcPoint(
      jd,
      pointConfig.sweId
    )

    points[id] = {
      longitude: result.longitude,
      latitude: result.latitude,
      distance: result.distance,
      speed: result.longitudeSpeed,
      pointType: pointConfig.pointType,
      pointGroup: pointConfig.pointGroup
    }
  }

  if (points.northNodeMean) {
    points.southNodeMean = {
      ...createOppositePoint(points.northNodeMean),
      pointType: 'calculated',
      pointGroup: 'node'
    }
  }

  if (points.northNodeTrue) {
    points.southNodeTrue = {
      ...createOppositePoint(points.northNodeTrue),
      pointType: 'calculated',
      pointGroup: 'node'
    }
  }

  points.proserpina = calculateAvestanGlobaProserpina(jd)

  const houses = await calcHouses(
    jd,
    data.lat,
    data.lon
  )

  return {
    julianDay: jd,
    planets: points,
    points,
    houses
  }
}

module.exports = {
  buildChart
}
