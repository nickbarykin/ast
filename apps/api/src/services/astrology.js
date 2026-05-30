// astrology.js

const swe = require('swisseph')
const { DateTime } = require('luxon')
const PLANETS = require('../constants/planets')

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

function calcPlanet(jd, planet) {

  return new Promise((resolve, reject) => {

    swe.swe_calc_ut(
      jd,
      planet,
      swe.SEFLG_SWIEPH | swe.SEFLG_SPEED,
      (...args) => {

        console.log('================')
        console.log('PLANET ID:', planet)

        console.dir(args, {
          depth: null
        })

        // most wrappers return:
        // [ result ]

        if (!args || !args.length) {
          reject(new Error('Empty swiss response'))
          return
        }

        resolve(args[0])
      }
    )
  })
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

  const planets = {}

  console.log('PLANETS CONST')
  console.dir(PLANETS)

  for (const [id, planetId] of Object.entries(PLANETS)) {

    console.log('ITERATION:', id, planetId)

    const result = await calcPlanet(
      jd,
      planetId
    )

    console.log('FINAL RESULT:')
    console.dir(result, {
      depth: null
    })

    planets[id] = {
      longitude: result.longitude,
      latitude: result.latitude,
      distance: result.distance,
      speed: result.longitudeSpeed
    }
  }

  const houses = await calcHouses(
    jd,
    data.lat,
    data.lon
  )

  return {
    julianDay: jd,
    planets,
    houses
  }
}

module.exports = {
  buildChart
}