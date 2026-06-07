const swe = require('swisseph')

const POINTS = {
  sun: {
    sweId: swe.SE_SUN,
    pointType: 'planet',
    pointGroup: 'luminary'
  },

  moon: {
    sweId: swe.SE_MOON,
    pointType: 'planet',
    pointGroup: 'luminary'
  },

  mercury: {
    sweId: swe.SE_MERCURY,
    pointType: 'planet',
    pointGroup: 'planet'
  },

  venus: {
    sweId: swe.SE_VENUS,
    pointType: 'planet',
    pointGroup: 'planet'
  },

  mars: {
    sweId: swe.SE_MARS,
    pointType: 'planet',
    pointGroup: 'planet'
  },

  jupiter: {
    sweId: swe.SE_JUPITER,
    pointType: 'planet',
    pointGroup: 'planet'
  },

  saturn: {
    sweId: swe.SE_SATURN,
    pointType: 'planet',
    pointGroup: 'planet'
  },

  uranus: {
    sweId: swe.SE_URANUS,
    pointType: 'planet',
    pointGroup: 'planet'
  },

  neptune: {
    sweId: swe.SE_NEPTUNE,
    pointType: 'planet',
    pointGroup: 'planet'
  },

  pluto: {
    sweId: swe.SE_PLUTO,
    pointType: 'planet',
    pointGroup: 'planet'
  },

  chiron: {
    sweId: swe.SE_CHIRON,
    pointType: 'minor_body',
    pointGroup: 'asteroid'
  },

  northNodeMean: {
    sweId: swe.SE_MEAN_NODE,
    pointType: 'calculated',
    pointGroup: 'node'
  },

  northNodeTrue: {
    sweId: swe.SE_TRUE_NODE,
    pointType: 'calculated',
    pointGroup: 'node'
  },

  lilithMean: {
    sweId: swe.SE_MEAN_APOG,
    pointType: 'calculated',
    pointGroup: 'fictional'
  },

  lilithOsculating: {
    sweId: swe.SE_OSCU_APOG,
    pointType: 'calculated',
    pointGroup: 'fictional'
  }
}

module.exports = POINTS