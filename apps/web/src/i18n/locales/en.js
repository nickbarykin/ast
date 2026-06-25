export const en = {
  code: 'en',
  name: 'English',
  labels: {
    lblLanguage: 'Language',
    lblNatalChart: 'Natal Chart',
    lblDate: 'Date',
    lblTime: 'Time',
    lblLatitude: 'Latitude',
    lblLongitude: 'Longitude',
    lblTimezone: 'Timezone',
    lblCalculate: 'Calculate',
    lblBrowserTimezone: 'Browser TZ',
    lblLayout: 'Layout',
    lblReset: 'Reset',
    lblReady: 'Ready',
    lblJulianDay: 'JD',
    lblAscendantShort: 'ASC',
    lblHouses: 'Houses',
    lblAspects: 'Aspects',
    lblToolbar: 'Toolbar',
    lblAspectSettings: 'Aspect Settings',
    lblAspectSettingsNote: 'Effective orb = aspect orb + both point modifiers. Filters already calculated aspects.',
    lblAspectTypes: 'Types and orbs',
    lblAspectPoints: 'Points',
    lblLayerPalette: 'Layers',
    lblZodiacLayer: 'Zodiac',
    lblAngleLayer: 'Angles',
    lblHouseLayer: 'Houses',
    lblPointLayer: 'Points',
    lblAspectList: 'Aspects',
    lblNoVisibleAspects: 'No visible aspects',
    lblShow: 'Show',
    lblHide: 'Hide',
    lblSelectAll: 'All',
    lblNoAspectsYet: 'Settings apply after calculating a chart',
    lblClose: 'Close',
    lblDone: 'Done',
    lblHouseInner: 'House inner',
    lblHouseOuter: 'House outer',
    lblNode: 'Node',
    lblEntity: 'Entity',
    lblRelation: 'Relation',
    lblLinks: 'Links',
    lblRole: 'Role',
    lblKind: 'Kind',
    lblStatusIdle: 'Idle',
    lblStatusLoading: 'Loading',
    lblStatusSuccess: 'Success',
    lblStatusError: 'Error',

    lblSun: 'Sun',
    lblMoon: 'Moon',
    lblMercury: 'Mercury',
    lblVenus: 'Venus',
    lblMars: 'Mars',
    lblJupiter: 'Jupiter',
    lblSaturn: 'Saturn',
    lblUranus: 'Uranus',
    lblNeptune: 'Neptune',
    lblPluto: 'Pluto',
    lblChiron: 'Chiron',
    lblNorthNodeMean: 'Mean North Node',
    lblSouthNodeMean: 'Mean South Node',
    lblNorthNodeTrue: 'True North Node',
    lblSouthNodeTrue: 'True South Node',
    lblLilithMean: 'Mean Lilith',
    lblLilithOsculating: 'Osculating Lilith',
    lblProserpina: 'Proserpina',
    lblAscendant: 'Ascendant',
    lblDescendant: 'Descendant',
    lblMc: 'MC',
    lblIc: 'IC',
    lblVertex: 'Vertex',

    lblAries: 'Aries',
    lblTaurus: 'Taurus',
    lblGemini: 'Gemini',
    lblCancer: 'Cancer',
    lblLeo: 'Leo',
    lblVirgo: 'Virgo',
    lblLibra: 'Libra',
    lblScorpio: 'Scorpio',
    lblSagittarius: 'Sagittarius',
    lblCapricorn: 'Capricorn',
    lblAquarius: 'Aquarius',
    lblPisces: 'Pisces',

    lblConjunction: 'Conjunction',
    lblSextile: 'Sextile',
    lblSquare: 'Square',
    lblTrine: 'Trine',
    lblOpposition: 'Opposition'
  },
  messages: {
    houseLabel: ({ number }) => `House ${number}`,
    degreeInSign: ({ degree, signId, i18n }) => (
      `${degree}° ${i18n.sign(signId)}`
    ),
    angleAxisLabel: ({ fromId, toId, i18n }) => (
      `${i18n.point(fromId)} - ${i18n.point(toId)}`
    ),
    aspectLabel: ({ pointAId, aspectType, pointBId, i18n }) => (
      `${i18n.point(pointAId)} ${i18n.aspect(aspectType).toLowerCase()} ${i18n.point(pointBId)}`
    ),
    aspectOrbLabel: ({ aspectType, i18n }) => (
      `Orb: ${i18n.aspect(aspectType).toLowerCase()}`
    ),
    pointOrbModifierLabel: ({ pointId, i18n }) => (
      `Orb modifier: ${i18n.point(pointId)}`
    ),
    aspectPairLabel: ({ pointAId, pointBId, i18n }) => (
      `${i18n.point(pointAId)} - ${i18n.point(pointBId)}`
    ),
    visibleAspectsLabel: ({ count }) => (
      `Visible aspects: ${count}`
    )
  }
}
