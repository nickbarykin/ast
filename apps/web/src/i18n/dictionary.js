import { en } from './locales/en'
import { ru } from './locales/ru'

export const LOCALE_CODES = Object.freeze({
  EN: 'en',
  RU: 'ru'
})

export const LOCALES = Object.freeze({
  [LOCALE_CODES.EN]: en,
  [LOCALE_CODES.RU]: ru
})

const POINT_LABEL_KEYS = Object.freeze({
  sun: 'lblSun',
  moon: 'lblMoon',
  mercury: 'lblMercury',
  venus: 'lblVenus',
  mars: 'lblMars',
  jupiter: 'lblJupiter',
  saturn: 'lblSaturn',
  uranus: 'lblUranus',
  neptune: 'lblNeptune',
  pluto: 'lblPluto',
  chiron: 'lblChiron',
  northNodeMean: 'lblNorthNodeMean',
  southNodeMean: 'lblSouthNodeMean',
  northNodeTrue: 'lblNorthNodeTrue',
  southNodeTrue: 'lblSouthNodeTrue',
  lilithMean: 'lblLilithMean',
  lilithOsculating: 'lblLilithOsculating',
  proserpina: 'lblProserpina',
  ascendant: 'lblAscendant',
  descendant: 'lblDescendant',
  mc: 'lblMc',
  ic: 'lblIc',
  vertex: 'lblVertex'
})

const SIGN_LABEL_KEYS = Object.freeze({
  aries: 'lblAries',
  taurus: 'lblTaurus',
  gemini: 'lblGemini',
  cancer: 'lblCancer',
  leo: 'lblLeo',
  virgo: 'lblVirgo',
  libra: 'lblLibra',
  scorpio: 'lblScorpio',
  sagittarius: 'lblSagittarius',
  capricorn: 'lblCapricorn',
  aquarius: 'lblAquarius',
  pisces: 'lblPisces'
})

const ASPECT_LABEL_KEYS = Object.freeze({
  conjunction: 'lblConjunction',
  sextile: 'lblSextile',
  square: 'lblSquare',
  trine: 'lblTrine',
  opposition: 'lblOpposition'
})

const STATUS_LABEL_KEYS = Object.freeze({
  idle: 'lblStatusIdle',
  loading: 'lblStatusLoading',
  success: 'lblStatusSuccess',
  error: 'lblStatusError'
})

function readLabel(locale, key, form = 'default') {
  const value = locale.labels[key]

  if (typeof value === 'string') {
    return value
  }

  return value?.[form] ?? value?.default ?? key
}

export function createI18n(localeCode) {
  const locale = LOCALES[localeCode] ?? en

  const i18n = {
    code: locale.code,
    name: locale.name,

    label(key, form) {
      return readLabel(locale, key, form)
    },

    ui(key, form) {
      return readLabel(locale, key, form)
    },

    point(pointId, form) {
      return readLabel(locale, POINT_LABEL_KEYS[pointId] ?? pointId, form)
    },

    sign(signId, form) {
      return readLabel(locale, SIGN_LABEL_KEYS[signId] ?? signId, form)
    },

    aspect(aspectType, form) {
      return readLabel(locale, ASPECT_LABEL_KEYS[aspectType] ?? aspectType, form)
    },

    status(statusId) {
      return readLabel(locale, STATUS_LABEL_KEYS[statusId] ?? statusId)
    },

    message(messageId, payload = {}) {
      const message = locale.messages[messageId]

      if (!message) {
        return messageId
      }

      return message({ ...payload, i18n })
    }
  }

  return i18n
}
