// src/astrology/model/timezones.js

export const TimezoneId = Object.freeze({
  UTC: 'UTC',

  EUROPE_MOSCOW: 'Europe/Moscow',
  ASIA_TASHKENT: 'Asia/Tashkent',
  ASIA_DUBAI: 'Asia/Dubai',
  ASIA_BAKU: 'Asia/Baku',
  ASIA_YEKATERINBURG: 'Asia/Yekaterinburg',

  AMERICA_NEW_YORK: 'America/New_York',
  AMERICA_ATLANTA: 'America/New_York',
  AMERICA_CHICAGO: 'America/Chicago',
  AMERICA_DENVER: 'America/Denver',
  AMERICA_LOS_ANGELES: 'America/Los_Angeles',

  EUROPE_LONDON: 'Europe/London',
  EUROPE_PARIS: 'Europe/Paris',
  EUROPE_BERLIN: 'Europe/Berlin',
  EUROPE_ISTANBUL: 'Europe/Istanbul'
})

export const TIMEZONE_OPTIONS = Object.freeze([
  {
    id: TimezoneId.UTC,
    label: 'UTC'
  },
  {
    id: TimezoneId.EUROPE_MOSCOW,
    label: 'Moscow — Europe/Moscow'
  },
  {
    id: TimezoneId.ASIA_TASHKENT,
    label: 'Tashkent — Asia/Tashkent'
  },
  {
    id: TimezoneId.ASIA_YEKATERINBURG,
    label: 'Yekaterinburg - Asia/Yekaterinburg'
  },
  {
    id: TimezoneId.ASIA_DUBAI,
    label: 'Dubai / Abu Dhabi — Asia/Dubai'
  },
  {
    id: TimezoneId.ASIA_BAKU,
    label: 'Baku — Asia/Baku'
  },
  {
    id: TimezoneId.AMERICA_NEW_YORK,
    label: 'New York / Atlanta — America/New_York'
  },
  {
    id: TimezoneId.AMERICA_CHICAGO,
    label: 'Chicago — America/Chicago'
  },
  {
    id: TimezoneId.AMERICA_DENVER,
    label: 'Denver — America/Denver'
  },
  {
    id: TimezoneId.AMERICA_LOS_ANGELES,
    label: 'Los Angeles — America/Los_Angeles'
  },
  {
    id: TimezoneId.EUROPE_LONDON,
    label: 'London — Europe/London'
  },
  {
    id: TimezoneId.EUROPE_PARIS,
    label: 'Paris — Europe/Paris'
  },
  {
    id: TimezoneId.EUROPE_BERLIN,
    label: 'Berlin — Europe/Berlin'
  },
  {
    id: TimezoneId.EUROPE_ISTANBUL,
    label: 'Istanbul — Europe/Istanbul'
  }
])