export const ru = {
  code: 'ru',
  name: 'Русский',
  labels: {
    lblLanguage: 'Язык',
    lblNatalChart: 'Натальная карта',
    lblDate: 'Дата',
    lblTime: 'Время',
    lblLatitude: 'Широта',
    lblLongitude: 'Долгота',
    lblTimezone: 'Часовой пояс',
    lblCalculate: 'Рассчитать',
    lblBrowserTimezone: 'Часовой пояс браузера',
    lblLayout: 'Макет',
    lblReset: 'Сбросить',
    lblReady: 'Готово',
    lblJulianDay: 'JD',
    lblAscendantShort: 'ASC',
    lblHouses: 'Дома',
    lblAspects: 'Аспекты',
    lblToolbar: 'Панель инструментов',
    lblAspectSettings: 'Настройки аспектов',
    lblAspectSettingsNote: 'Итоговый орбис = орбис аспекта + модификаторы обеих точек. Фильтрует уже рассчитанные аспекты.',
    lblAspectTypes: 'Типы и орбисы',
    lblAspectPoints: 'Точки',
    lblLayerPalette: 'Слои',
    lblZodiacLayer: 'Зодиак',
    lblAngleLayer: 'Углы',
    lblHouseLayer: 'Дома',
    lblPointLayer: 'Точки',
    lblAspectList: 'Аспекты',
    lblNoVisibleAspects: 'Нет видимых аспектов',
    lblShow: 'Показать',
    lblHide: 'Скрыть',
    lblSelectAll: 'Все',
    lblNoAspectsYet: 'Настройки применятся после расчета карты',
    lblClose: 'Закрыть',
    lblDone: 'Готово',
    lblHouseInner: 'Внутр. радиус домов',
    lblHouseOuter: 'Внеш. радиус домов',
    lblNode: 'Узел',
    lblEntity: 'Сущность',
    lblRelation: 'Связь',
    lblLinks: 'Связи',
    lblRole: 'Роль',
    lblKind: 'Тип',
    lblStatusIdle: 'Ожидание',
    lblStatusLoading: 'Расчет',
    lblStatusSuccess: 'Готово',
    lblStatusError: 'Ошибка',

    lblSun: {
      default: 'Солнце',
      instrumental: 'Солнцем'
    },
    lblMoon: {
      default: 'Луна',
      instrumental: 'Луной'
    },
    lblMercury: {
      default: 'Меркурий',
      instrumental: 'Меркурием'
    },
    lblVenus: {
      default: 'Венера',
      instrumental: 'Венерой'
    },
    lblMars: {
      default: 'Марс',
      instrumental: 'Марсом'
    },
    lblJupiter: {
      default: 'Юпитер',
      instrumental: 'Юпитером'
    },
    lblSaturn: {
      default: 'Сатурн',
      instrumental: 'Сатурном'
    },
    lblUranus: {
      default: 'Уран',
      instrumental: 'Ураном'
    },
    lblNeptune: {
      default: 'Нептун',
      instrumental: 'Нептуном'
    },
    lblPluto: {
      default: 'Плутон',
      instrumental: 'Плутоном'
    },
    lblChiron: {
      default: 'Хирон',
      instrumental: 'Хироном'
    },
    lblNorthNodeMean: {
      default: 'Средний Северный узел',
      instrumental: 'Средним Северным узлом'
    },
    lblSouthNodeMean: {
      default: 'Средний Южный узел',
      instrumental: 'Средним Южным узлом'
    },
    lblNorthNodeTrue: {
      default: 'Истинный Северный узел',
      instrumental: 'Истинным Северным узлом'
    },
    lblSouthNodeTrue: {
      default: 'Истинный Южный узел',
      instrumental: 'Истинным Южным узлом'
    },
    lblLilithMean: {
      default: 'Средняя Лилит',
      instrumental: 'Средней Лилит'
    },
    lblLilithOsculating: {
      default: 'Оскулирующая Лилит',
      instrumental: 'Оскулирующей Лилит'
    },
    lblProserpina: {
      default: 'Прозерпина',
      instrumental: 'Прозерпиной'
    },
    lblAscendant: {
      default: 'Асцендент',
      instrumental: 'Асцендентом'
    },
    lblDescendant: {
      default: 'Десцендент',
      instrumental: 'Десцендентом'
    },
    lblMc: 'MC',
    lblIc: 'IC',
    lblVertex: {
      default: 'Вертекс',
      instrumental: 'Вертексом'
    },

    lblAries: 'Овен',
    lblTaurus: 'Телец',
    lblGemini: 'Близнецы',
    lblCancer: 'Рак',
    lblLeo: 'Лев',
    lblVirgo: 'Дева',
    lblLibra: 'Весы',
    lblScorpio: 'Скорпион',
    lblSagittarius: 'Стрелец',
    lblCapricorn: 'Козерог',
    lblAquarius: 'Водолей',
    lblPisces: 'Рыбы',

    lblConjunction: 'Соединение',
    lblSextile: 'Секстиль',
    lblSquare: 'Квадрат',
    lblTrine: 'Трин',
    lblOpposition: 'Оппозиция'
  },
  messages: {
    houseLabel: ({ number }) => `${number} дом`,
    degreeInSign: ({ degree, signId, i18n }) => (
      `${degree}° ${i18n.sign(signId)}`
    ),
    angleAxisLabel: ({ fromId, toId, i18n }) => (
      `${i18n.point(fromId)} - ${i18n.point(toId)}`
    ),
    aspectLabel: ({ pointAId, aspectType, pointBId, i18n }) => (
      `${i18n.point(pointAId)}: ${i18n.aspect(aspectType).toLowerCase()} с ${i18n.point(pointBId, 'instrumental')}`
    ),
    aspectOrbLabel: ({ aspectType, i18n }) => (
      `Орбис: ${i18n.aspect(aspectType).toLowerCase()}`
    ),
    pointOrbModifierLabel: ({ pointId, i18n }) => (
      `Модификатор орбиса: ${i18n.point(pointId)}`
    ),
    aspectPairLabel: ({ pointAId, pointBId, i18n }) => (
      `${i18n.point(pointAId)} - ${i18n.point(pointBId)}`
    ),
    visibleAspectsLabel: ({ count }) => (
      `Показано аспектов: ${count}`
    )
  }
}
