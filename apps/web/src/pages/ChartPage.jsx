// src/pages/ChartPage.jsx

import { useMemo, useState } from 'react'

import NatalChartRenderer from '../components/chart/NatalChartRenderer'
import ChartHintCard from '../components/chart/ChartHintCard'
import { buildNatalLayout } from '../astrology/layout/buildNatalLayout'
import { RING_ID } from '../astrology/layout/rings'
import { fetchNormalizedChartData } from '../services/api/chartApi'
import { LOCALE_CODES, useI18n } from '../i18n'
import './ChartPage.css'
import {
  createChartAccessModel,
  TIMEZONE_OPTIONS,
  TimezoneId
} from '../astrology/model'

const CHART_SIZE = 680
const CHART_CENTER = CHART_SIZE / 2
const MIN_HOUSE_WIDTH = 48
const MIN_HOUSE_INNER_RADIUS = 105
const MAX_HOUSE_OUTER_RADIUS = 300
const ASPECT_TYPES = ['conjunction', 'sextile', 'square', 'trine', 'opposition']
const DEFAULT_ASPECT_ORBS = Object.freeze({
  conjunction: 8,
  sextile: 5,
  square: 6,
  trine: 6,
  opposition: 8
})

const DEFAULT_POINT_ORB_MODIFIERS = Object.freeze({
  sun: 2,
  moon: 2,
  mercury: 0,
  venus: 0,
  mars: 0,
  jupiter: 0,
  saturn: 0,
  uranus: -1,
  neptune: -1,
  pluto: -1,
  chiron: -2,
  northNodeMean: -2,
  southNodeMean: -2,
  northNodeTrue: -2,
  southNodeTrue: -2,
  lilithMean: -3,
  lilithOsculating: -3,
  ascendant: -2,
  mc: -2,
  vertex: -3,
  proserpina: -3
})
const ASPECT_POINT_IDS = Object.freeze(Object.keys(DEFAULT_POINT_ORB_MODIFIERS))

const DEFAULT_RING_OPTIONS = {
  [RING_ID.HOUSES]: {
    innerRadius: 180,
    outerRadius: 260
  }
}

const DEFAULT_ASPECT_SETTINGS = {
  enabledTypes: Object.fromEntries(
    ASPECT_TYPES.map((aspectType) => [aspectType, true])
  ),
  orbs: DEFAULT_ASPECT_ORBS,
  pointModifiers: DEFAULT_POINT_ORB_MODIFIERS,
  enabledPointIds: null
}

const DEFAULT_LAYER_VISIBILITY = {
  zodiac: true,
  houses: true,
  angles: true
}

function formatDegree(value) {
  if (!Number.isFinite(value)) {
    return '—'
  }

  return value.toFixed(2)
}

function formatOrb(value) {
  if (!Number.isFinite(value)) {
    return '—'
  }

  return value.toFixed(2)
}

function formatModifier(value) {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) {
    return value
  }

  return numberValue > 0 ? `+${numberValue}` : String(numberValue)
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function createPointEntityId(pointId) {
  return `point:${pointId}`
}

function createHouseEntityId(houseNumber) {
  return `house:${houseNumber}`
}

function getPointPositionLabel(point, i18n) {
  if (!point) {
    return ''
  }

  return i18n.message('degreeInSign', {
    degree: formatDegree(point.degreeInSign ?? point.longitude),
    signId: point.signId
  })
}

function getEffectiveAspectOrb(aspect, aspectSettings) {
  const baseOrb = Number(aspectSettings.orbs[aspect.aspectType])
  const pointAModifier = Number(
    aspectSettings.pointModifiers[aspect.pointAId] ?? 0
  )
  const pointBModifier = Number(
    aspectSettings.pointModifiers[aspect.pointBId] ?? 0
  )

  if (
    !Number.isFinite(baseOrb) ||
    !Number.isFinite(pointAModifier) ||
    !Number.isFinite(pointBModifier)
  ) {
    return null
  }

  return Math.max(0, baseOrb + pointAModifier + pointBModifier)
}

export default function ChartPage() {
  const { i18n, localeCode, setLocale } = useI18n()
  const [form, setForm] = useState({
    date: '1991-11-05',
    time: '12:00',
    lat: '56.06',
    lon: '63.35',
    timezone: TimezoneId.ASIA_YEKATERINBURG
  })

  const [ringOptions, setRingOptions] = useState(DEFAULT_RING_OPTIONS)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [chartModel, setChartModel] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [hintPosition, setHintPosition] = useState({ x: 0, y: 0 })
  const [hintMode] = useState('floating')
  const [activeHandle, setActiveHandle] = useState(null)
  const [isAspectSettingsOpen, setIsAspectSettingsOpen] = useState(false)
  const [aspectSettings, setAspectSettings] = useState(DEFAULT_ASPECT_SETTINGS)
  const [visibleLayers, setVisibleLayers] = useState(DEFAULT_LAYER_VISIBILITY)
  const [visiblePointIds, setVisiblePointIds] = useState(null)
  const [selectedEntityId, setSelectedEntityId] = useState(null)
  const [selectionHistory, setSelectionHistory] = useState([])
  const [selectionFuture, setSelectionFuture] = useState([])

  const aspectPointIds = useMemo(() => {
    if (!chartModel) {
      return ASPECT_POINT_IDS
    }

    return Array.from(
      new Set(
        [
          ...ASPECT_POINT_IDS,
          ...chartModel.aspects.flatMap((aspect) => [
            aspect.pointAId,
            aspect.pointBId
          ])
        ]
      )
    )
  }, [chartModel])

  const enabledPointIds = aspectSettings.enabledPointIds ?? aspectPointIds
  const layerPointIds = visiblePointIds ?? aspectPointIds
  const renderedPointIds = useMemo(() => (
    enabledPointIds.filter((pointId) => layerPointIds.includes(pointId))
  ), [enabledPointIds, layerPointIds])
  const allPoints = useMemo(() => {
    if (!chartModel) {
      return {}
    }

    return {
      ...chartModel.points,
      ...chartModel.angles,
      ...(chartModel.sensitivePoints || {})
    }
  }, [chartModel])

  const renderedChartModel = useMemo(() => {
    if (!chartModel) {
      return null
    }

    const enabledPointSet = new Set(renderedPointIds)
    const aspects = chartModel.aspects.filter((aspect) => {
      const maxOrb = getEffectiveAspectOrb(aspect, aspectSettings)

      return (
        aspectSettings.enabledTypes[aspect.aspectType] &&
        maxOrb != null &&
        aspect.orb <= maxOrb &&
        enabledPointSet.has(aspect.pointAId) &&
        enabledPointSet.has(aspect.pointBId)
      )
    })
    const points = Object.fromEntries(
      Object.entries(chartModel.points).filter(([pointId]) => (
        enabledPointSet.has(pointId)
      ))
    )
    const sensitivePoints = Object.fromEntries(
      Object.entries(chartModel.sensitivePoints || {}).filter(([pointId]) => (
        enabledPointSet.has(pointId)
      ))
    )

    return {
      ...chartModel,
      points,
      sensitivePoints,
      aspects
    }
  }, [aspectSettings, chartModel, renderedPointIds])

  const sortedVisibleAspects = useMemo(() => {
    if (!renderedChartModel) {
      return []
    }

    const pointOrder = new Map(
      aspectPointIds.map((pointId, index) => [pointId, index])
    )

    return [...renderedChartModel.aspects].sort((aspectA, aspectB) => {
      const pointAOrder = pointOrder.get(aspectA.pointAId) ?? Number.MAX_SAFE_INTEGER
      const pointBOrder = pointOrder.get(aspectB.pointAId) ?? Number.MAX_SAFE_INTEGER

      if (pointAOrder !== pointBOrder) {
        return pointAOrder - pointBOrder
      }

      return aspectA.orb - aspectB.orb
    })
  }, [aspectPointIds, renderedChartModel])

  const layout = useMemo(() => {
    if (!renderedChartModel) {
      return null
    }

    return buildNatalLayout(renderedChartModel, {
      width: CHART_SIZE,
      height: CHART_SIZE,
      rings: ringOptions
    })
  }, [ringOptions, renderedChartModel])

  const visibleLayout = useMemo(() => {
    if (!layout) {
      return null
    }

    return {
      ...layout,
      signs: visibleLayers.zodiac ? layout.signs : [],
      houses: visibleLayers.houses ? layout.houses : [],
      angles: visibleLayers.angles ? layout.angles : {
        axes: [],
        labels: []
      }
    }
  }, [layout, visibleLayers])

  const chartSummary = useMemo(() => {
    if (!chartModel) {
      return null
    }

    const sun = chartModel.getPoint('sun')
    const moon = chartModel.getPoint('moon')
    const ascendant = chartModel.getAngle('ascendant')

    return {
      julianDay: chartModel.meta.julianDay,
      sun,
      moon,
      ascendant,
      housesCount: chartModel.getHouses().length,
      aspectsCount: renderedChartModel?.aspects.length ?? 0
    }
  }, [chartModel, renderedChartModel])

  const houseRing = ringOptions[RING_ID.HOUSES]
  const layoutHandlePositions = {
    innerRadius: {
      x: CHART_CENTER + houseRing.innerRadius,
      y: CHART_CENTER
    },
    outerRadius: {
      x: CHART_CENTER + houseRing.outerRadius,
      y: CHART_CENTER
    }
  }

  function updateHintPosition(event) {
    const rect = event.currentTarget.ownerSVGElement.getBoundingClientRect()

    setHintPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    })
  }

  function handleNodeEnter(node, event) {
    setHoveredNode(node)
    updateHintPosition(event)
  }

  function handleNodeMove(node, event) {
    setHoveredNode(node)
    updateHintPosition(event)
  }

  function handleNodeLeave() {
    setHoveredNode(null)
  }

  function selectEntity(entityId) {
    if (!entityId || entityId === selectedEntityId) {
      return
    }

    if (selectedEntityId) {
      setSelectionHistory([...selectionHistory, selectedEntityId])
    }

    setSelectionFuture([])
    setSelectedEntityId(entityId)
  }

  function goBackSelection() {
    if (selectionHistory.length === 0) {
      return
    }

    const previousEntityId = selectionHistory[selectionHistory.length - 1]

    setSelectionHistory(selectionHistory.slice(0, -1))
    setSelectionFuture(
      selectedEntityId
        ? [selectedEntityId, ...selectionFuture]
        : selectionFuture
    )
    setSelectedEntityId(previousEntityId)
  }

  function goForwardSelection() {
    if (selectionFuture.length === 0) {
      return
    }

    const nextEntityId = selectionFuture[0]

    setSelectionHistory(
      selectedEntityId
        ? [...selectionHistory, selectedEntityId]
        : selectionHistory
    )
    setSelectionFuture(selectionFuture.slice(1))
    setSelectedEntityId(nextEntityId)
  }

  function handleNodeClick(node, event) {
    event.stopPropagation()
    selectEntity(node.entityId || node.relationId)
  }

  function getPointAspects(pointId) {
    if (!chartModel) {
      return []
    }

    return chartModel.aspects
      .filter((aspect) => (
        aspect.pointAId === pointId || aspect.pointBId === pointId
      ))
      .sort((aspectA, aspectB) => aspectA.orb - aspectB.orb)
  }

  function getHousePoints(houseNumber) {
    return Object.values(allPoints).filter((point) => (
      point.houseNumber === houseNumber
    ))
  }

  function getSelectedEntity() {
    if (!selectedEntityId || !chartModel) {
      return null
    }

    if (selectedEntityId.startsWith('point:')) {
      const pointId = selectedEntityId.replace('point:', '')
      const point = allPoints[pointId]

      return point ? { type: 'point', id: pointId, entity: point } : null
    }

    if (selectedEntityId.startsWith('house:')) {
      const houseNumber = Number(selectedEntityId.replace('house:', ''))
      const house = chartModel.houses.find((item) => item.number === houseNumber)

      return house ? { type: 'house', id: selectedEntityId, entity: house } : null
    }

    if (selectedEntityId.startsWith('aspect:')) {
      const aspect = chartModel.aspects.find((item) => item.id === selectedEntityId)

      return aspect ? { type: 'aspect', id: selectedEntityId, entity: aspect } : null
    }

    return null
  }

  function updateField(fieldName, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value
    }))
  }

  function getSvgPoint(event) {
    const rect = event.currentTarget.ownerSVGElement.getBoundingClientRect()
    const x = (event.clientX - rect.left) * (CHART_SIZE / rect.width)
    const y = (event.clientY - rect.top) * (CHART_SIZE / rect.height)

    return { x, y }
  }

  function getRadiusFromEvent(event) {
    const point = getSvgPoint(event)
    const dx = point.x - CHART_CENTER
    const dy = point.y - CHART_CENTER

    return Math.sqrt(dx * dx + dy * dy)
  }

  function updateHouseRadius(handle, radius) {
    setRingOptions((currentOptions) => {
      const currentHouseRing = currentOptions[RING_ID.HOUSES]
      const nextHouseRing = { ...currentHouseRing }

      if (handle === 'innerRadius') {
        nextHouseRing.innerRadius = clamp(
          radius,
          MIN_HOUSE_INNER_RADIUS,
          currentHouseRing.outerRadius - MIN_HOUSE_WIDTH
        )
      }

      if (handle === 'outerRadius') {
        nextHouseRing.outerRadius = clamp(
          radius,
          currentHouseRing.innerRadius + MIN_HOUSE_WIDTH,
          MAX_HOUSE_OUTER_RADIUS
        )
      }

      return {
        ...currentOptions,
        [RING_ID.HOUSES]: nextHouseRing
      }
    })
  }

  function handleLayoutPointerDown(event) {
    const handle = event.target.dataset.handle

    if (!handle) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    setActiveHandle(handle)
    updateHouseRadius(handle, getRadiusFromEvent(event))
  }

  function handleLayoutPointerMove(event) {
    if (!activeHandle) {
      return
    }

    event.preventDefault()
    updateHouseRadius(activeHandle, getRadiusFromEvent(event))
  }

  function handleLayoutPointerUp(event) {
    if (activeHandle) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    setActiveHandle(null)
  }

  function resetLayout() {
    setRingOptions(DEFAULT_RING_OPTIONS)
  }

  function resetAspectSettings() {
    setAspectSettings(DEFAULT_ASPECT_SETTINGS)
  }

  function updateAspectType(aspectType, isEnabled) {
    setAspectSettings((currentSettings) => ({
      ...currentSettings,
      enabledTypes: {
        ...currentSettings.enabledTypes,
        [aspectType]: isEnabled
      }
    }))
  }

  function updateAspectOrb(aspectType, value) {
    setAspectSettings((currentSettings) => ({
      ...currentSettings,
      orbs: {
        ...currentSettings.orbs,
        [aspectType]: value
      }
    }))
  }

  function updatePointOrbModifier(pointId, value) {
    setAspectSettings((currentSettings) => ({
      ...currentSettings,
      pointModifiers: {
        ...currentSettings.pointModifiers,
        [pointId]: value
      }
    }))
  }

  function updateAspectPoint(pointId, isEnabled) {
    setAspectSettings((currentSettings) => {
      const currentPointIds = currentSettings.enabledPointIds ?? aspectPointIds
      const nextPointIds = isEnabled
        ? Array.from(new Set([...currentPointIds, pointId]))
        : currentPointIds.filter((currentPointId) => currentPointId !== pointId)

      return {
        ...currentSettings,
        enabledPointIds: nextPointIds
      }
    })
  }

  function selectAllAspectPoints() {
    setAspectSettings((currentSettings) => ({
      ...currentSettings,
      enabledPointIds: null
    }))
  }

  function toggleLayer(layerId) {
    setVisibleLayers((currentLayers) => ({
      ...currentLayers,
      [layerId]: !currentLayers[layerId]
    }))
  }

  function togglePointVisibility(pointId) {
    setVisiblePointIds((currentPointIds) => {
      const currentVisiblePointIds = currentPointIds ?? aspectPointIds

      if (currentVisiblePointIds.includes(pointId)) {
        return currentVisiblePointIds.filter((visiblePointId) => (
          visiblePointId !== pointId
        ))
      }

      return Array.from(new Set([...currentVisiblePointIds, pointId]))
    })
  }

  function isPointVisible(pointId) {
    return layerPointIds.includes(pointId)
  }

  function getVisibilityLabel(isVisible) {
    return isVisible ? i18n.ui('lblHide') : i18n.ui('lblShow')
  }

  function useBrowserTimezone() {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    updateField('timezone', browserTimezone)
  }

  function toggleLocale() {
    setLocale(localeCode === LOCALE_CODES.EN
      ? LOCALE_CODES.RU
      : LOCALE_CODES.EN)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setStatus('loading')
    setError(null)
    setHoveredNode(null)

    try {
      const input = {
        date: form.date,
        time: form.time,
        lat: Number(form.lat),
        lon: Number(form.lon),
        timezone: form.timezone
      }

      const normalizedChart = await fetchNormalizedChartData(input)
      const model = createChartAccessModel(normalizedChart)

      setChartModel(model)
      setStatus('success')
    } catch (requestError) {
      console.error(requestError)

      setError(requestError.message)
      setStatus('error')
    }
  }

  const selectedEntity = getSelectedEntity()

  return (
    <main className="chart-page">
      <div className="chart-page__locale-switcher">
        <span>{i18n.ui('lblLanguage')}</span>
        <button
          type="button"
          onClick={toggleLocale}
          className="chart-page__locale-button"
          aria-label={i18n.ui('lblLanguage')}
        >
          {localeCode.toUpperCase()}
        </button>
      </div>

      <section className="chart-page__workspace">
        <aside className="chart-page__sidebar">
          <header className="chart-page__header">
            <h1 className="chart-page__title">{i18n.ui('lblNatalChart')}</h1>
            <div className={`chart-page__status chart-page__status--${status}`}>
              {i18n.status(status)}
            </div>
          </header>

          <form onSubmit={handleSubmit} className="chart-page__form">
            <label className="chart-page__field">
              <span className="chart-page__label">{i18n.ui('lblDate')}</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => updateField('date', event.target.value)}
                className="chart-page__input"
              />
            </label>

            <label className="chart-page__field">
              <span className="chart-page__label">{i18n.ui('lblTime')}</span>
              <input
                type="time"
                value={form.time}
                onChange={(event) => updateField('time', event.target.value)}
                className="chart-page__input"
              />
            </label>

            <label className="chart-page__field">
              <span className="chart-page__label">{i18n.ui('lblLatitude')}</span>
              <input
                type="number"
                step="0.000001"
                value={form.lat}
                onChange={(event) => updateField('lat', event.target.value)}
                className="chart-page__input"
              />
            </label>

            <label className="chart-page__field">
              <span className="chart-page__label">{i18n.ui('lblLongitude')}</span>
              <input
                type="number"
                step="0.000001"
                value={form.lon}
                onChange={(event) => updateField('lon', event.target.value)}
                className="chart-page__input"
              />
            </label>

            <label className="chart-page__field chart-page__field--wide">
              <span className="chart-page__label">{i18n.ui('lblTimezone')}</span>
              <select
                value={form.timezone}
                onChange={(event) => updateField('timezone', event.target.value)}
                className="chart-page__input"
              >
                {TIMEZONE_OPTIONS.map((timezone) => (
                  <option key={timezone.id} value={timezone.id}>
                    {timezone.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="chart-page__actions">
              <button
                type="submit"
                className="chart-page__button chart-page__button--primary"
                disabled={status === 'loading'}
              >
                {i18n.ui('lblCalculate')}
              </button>

              <button
                type="button"
                onClick={useBrowserTimezone}
                className="chart-page__button"
              >
                {i18n.ui('lblBrowserTimezone')}
              </button>
            </div>
          </form>

          {error && (
            <pre className="chart-page__error">
              {error}
            </pre>
          )}

          {chartSummary && (
            <section className="chart-page__summary">
              <div>
                <span>{i18n.ui('lblJulianDay')}</span>
                <strong>{chartSummary.julianDay.toFixed(5)}</strong>
              </div>
              <div>
                <span>{i18n.ui('lblAscendantShort')}</span>
                <strong>
                  {i18n.message('degreeInSign', {
                    degree: formatDegree(chartSummary.ascendant.longitude),
                    signId: chartSummary.ascendant.signId
                  })}
                </strong>
              </div>
              <div>
                <span>{i18n.point('sun')}</span>
                <strong>
                  {i18n.message('degreeInSign', {
                    degree: formatDegree(chartSummary.sun.longitude),
                    signId: chartSummary.sun.signId
                  })}
                </strong>
              </div>
              <div>
                <span>{i18n.point('moon')}</span>
                <strong>
                  {i18n.message('degreeInSign', {
                    degree: formatDegree(chartSummary.moon.longitude),
                    signId: chartSummary.moon.signId
                  })}
                </strong>
              </div>
              <div>
                <span>{i18n.ui('lblHouses')}</span>
                <strong>{chartSummary.housesCount}</strong>
              </div>
              <div>
                <span>{i18n.ui('lblAspects')}</span>
                <strong>{chartSummary.aspectsCount}</strong>
              </div>
            </section>
          )}

          <section className="chart-page__layout-panel">
            <div className="chart-page__section-head">
              <h2 className="chart-page__subtitle">{i18n.ui('lblLayout')}</h2>
              <button
                type="button"
                onClick={resetLayout}
                className="chart-page__text-button"
              >
                {i18n.ui('lblReset')}
              </button>
            </div>

            <div className="chart-page__layout-readout">
              <div>
                <span>{i18n.ui('lblHouseInner')}</span>
                <strong>{Math.round(houseRing.innerRadius)}</strong>
              </div>
              <div>
                <span>{i18n.ui('lblHouseOuter')}</span>
                <strong>{Math.round(houseRing.outerRadius)}</strong>
              </div>
            </div>
          </section>
        </aside>

        <section className="chart-page__stage">
          <div className="chart-page__toolbar" aria-label={i18n.ui('lblToolbar')}>
            <button
              type="button"
              className="chart-page__tool-button"
              onClick={() => setIsAspectSettingsOpen(true)}
            >
              {i18n.ui('lblAspectSettings')}
            </button>
          </div>

          <div className={`chart-page__stage-content${selectedEntity ? ' chart-page__stage-content--with-inspector' : ''}`}>
            <div className="chart-page__chart">
              {visibleLayout ? (
              <>
                <NatalChartRenderer
                  layout={visibleLayout}
                  i18n={i18n}
                  handlers={{
                    onNodeEnter: handleNodeEnter,
                    onNodeMove: handleNodeMove,
                    onNodeLeave: handleNodeLeave,
                    onNodeClick: handleNodeClick
                  }}
                  selectedEntityId={selectedEntityId}
                  editor={{
                    houseRing,
                    handlePositions: layoutHandlePositions,
                    onPointerDown: handleLayoutPointerDown,
                    onPointerMove: handleLayoutPointerMove,
                    onPointerUp: handleLayoutPointerUp
                  }}
                />

                <ChartHintCard
                  node={hoveredNode}
                  chartModel={chartModel}
                  i18n={i18n}
                  position={hintPosition}
                  mode={hintMode}
                  fixedPosition={{ x: 16, y: 16 }}
                  offset={{ x: 14, y: 14 }}
                />

              </>
              ) : (
              <div className="chart-page__empty">
                <span>{i18n.ui('lblReady')}</span>
              </div>
              )}
            </div>

            <aside className="chart-page__layer-palette">
              <header className="chart-page__layer-palette-header">
                <h2>{i18n.ui('lblLayerPalette')}</h2>
              </header>

              <div className="chart-page__layer-list">
                <div className="chart-page__layer-row" data-layer-id="zodiac">
                  <span>{i18n.ui('lblZodiacLayer')}</span>
                  <button
                    type="button"
                    className="chart-page__visibility-button"
                    aria-label={getVisibilityLabel(visibleLayers.zodiac)}
                    aria-pressed={visibleLayers.zodiac}
                    onClick={() => toggleLayer('zodiac')}
                  >
                    <span className="chart-page__visibility-icon" />
                  </button>
                </div>

                <div className="chart-page__layer-row" data-layer-id="angles">
                  <span>{i18n.ui('lblAngleLayer')}</span>
                  <button
                    type="button"
                    className="chart-page__visibility-button"
                    aria-label={getVisibilityLabel(visibleLayers.angles)}
                    aria-pressed={visibleLayers.angles}
                    onClick={() => toggleLayer('angles')}
                  >
                    <span className="chart-page__visibility-icon" />
                  </button>
                </div>

                <div className="chart-page__layer-row" data-layer-id="houses">
                  <span>{i18n.ui('lblHouseLayer')}</span>
                  <button
                    type="button"
                    className="chart-page__visibility-button"
                    aria-label={getVisibilityLabel(visibleLayers.houses)}
                    aria-pressed={visibleLayers.houses}
                    onClick={() => toggleLayer('houses')}
                  >
                    <span className="chart-page__visibility-icon" />
                  </button>
                </div>

                <details className="chart-page__layer-tree" data-layer-id="points" open>
                  <summary>
                    <span>{i18n.ui('lblPointLayer')}</span>
                  </summary>

                  <div className="chart-page__point-layer-list">
                    {aspectPointIds.map((pointId) => {
                      const pointIsVisible = isPointVisible(pointId)
                      const point = allPoints[pointId]
                      const pointEntityId = createPointEntityId(pointId)
                      const pointIsSelected = selectedEntityId === pointEntityId

                      return (
                        <div
                          key={pointId}
                          className={`chart-page__sub-layer-row${pointIsSelected ? ' chart-page__sub-layer-row--selected' : ''}`}
                          data-point-id={pointId}
                          onClick={() => selectEntity(pointEntityId)}
                        >
                          <span>{i18n.point(pointId)}</span>
                          <strong>
                            {point ? getPointPositionLabel(point, i18n) : '—'}
                          </strong>
                          <button
                            type="button"
                            className="chart-page__visibility-button"
                            aria-label={getVisibilityLabel(pointIsVisible)}
                            aria-pressed={pointIsVisible}
                            onClick={(event) => {
                              event.stopPropagation()
                              togglePointVisibility(pointId)
                            }}
                          >
                            <span className="chart-page__visibility-icon" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </details>

                <details className="chart-page__layer-tree" data-layer-id="aspects" open>
                  <summary>
                    <span>{i18n.ui('lblAspectList')}</span>
                  </summary>

                  <section className="chart-page__aspect-list-panel">
                  <div className="chart-page__aspect-list">
                    {sortedVisibleAspects.map((aspect) => (
                      <button
                        key={aspect.id}
                        type="button"
                        className={`chart-page__aspect-list-row${selectedEntityId === aspect.id ? ' chart-page__aspect-list-row--selected' : ''}`}
                        data-aspect-type={aspect.aspectType}
                        data-point-a-id={aspect.pointAId}
                        data-point-b-id={aspect.pointBId}
                        onClick={() => selectEntity(aspect.id)}
                      >
                        <span>{i18n.aspect(aspect.aspectType)}</span>
                        <strong>
                          {i18n.message('aspectPairLabel', {
                            pointAId: aspect.pointAId,
                            pointBId: aspect.pointBId
                          })}
                        </strong>
                        <em>{formatOrb(aspect.orb)}°</em>
                      </button>
                    ))}

                    {(!renderedChartModel || sortedVisibleAspects.length === 0) && (
                      <p className="chart-page__settings-empty">
                        {i18n.ui('lblNoVisibleAspects')}
                      </p>
                    )}
                  </div>
                  </section>
                </details>
              </div>
            </aside>

            {selectedEntity && (
              <aside className="chart-page__selection-inspector">
                <header className="chart-page__selection-header">
                  <div>
                    <span>{i18n.ui('lblSelected')}</span>
                    <h3>
                      {selectedEntity.type === 'point' && i18n.point(selectedEntity.id)}
                      {selectedEntity.type === 'aspect' && i18n.aspect(selectedEntity.entity.aspectType)}
                      {selectedEntity.type === 'house' && i18n.message('houseLabel', {
                        number: selectedEntity.entity.number
                      })}
                    </h3>
                  </div>

                  <div className="chart-page__selection-nav">
                    <button
                      type="button"
                      className="chart-page__nav-button"
                      aria-label={i18n.ui('lblBack')}
                      disabled={selectionHistory.length === 0}
                      onClick={goBackSelection}
                    >
                      {'<'}
                    </button>
                    <button
                      type="button"
                      className="chart-page__nav-button"
                      aria-label={i18n.ui('lblForward')}
                      disabled={selectionFuture.length === 0}
                      onClick={goForwardSelection}
                    >
                      {'>'}
                    </button>
                  </div>
                </header>

                {selectedEntity.type === 'point' && (
                  <div className="chart-page__selection-body">
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblKind')}</span>
                      <strong>{selectedEntity.entity.pointType}</strong>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblPointGroup')}</span>
                      <strong>{selectedEntity.entity.pointGroup}</strong>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblLongitude')}</span>
                      <strong>{formatDegree(selectedEntity.entity.longitude)}°</strong>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblZodiacLayer')}</span>
                      <strong>{getPointPositionLabel(selectedEntity.entity, i18n)}</strong>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblHouseLayer')}</span>
                      {selectedEntity.entity.houseNumber ? (
                        <button
                          type="button"
                          className="chart-page__entity-link"
                          onClick={() => selectEntity(createHouseEntityId(
                            selectedEntity.entity.houseNumber
                          ))}
                        >
                          {i18n.message('houseLabel', {
                            number: selectedEntity.entity.houseNumber
                          })}
                        </button>
                      ) : (
                        <strong>-</strong>
                      )}
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblRetrograde')}</span>
                      <strong>{selectedEntity.entity.isRetrograde ? i18n.ui('lblYes') : i18n.ui('lblNo')}</strong>
                    </div>
                    <div className="chart-page__selection-stack">
                      <span>{i18n.ui('lblAspectList')}</span>
                      {getPointAspects(selectedEntity.id).map((aspect) => (
                        <button
                          key={aspect.id}
                          type="button"
                          className="chart-page__entity-chip"
                          onClick={() => selectEntity(aspect.id)}
                        >
                          {i18n.aspect(aspect.aspectType)} · {i18n.message('aspectPairLabel', {
                            pointAId: aspect.pointAId,
                            pointBId: aspect.pointBId
                          })} · {formatOrb(aspect.orb)}°
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEntity.type === 'aspect' && (
                  <div className="chart-page__selection-body">
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblAspectTypes')}</span>
                      <strong>{i18n.aspect(selectedEntity.entity.aspectType)}</strong>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblFrom')}</span>
                      <button
                        type="button"
                        className="chart-page__entity-link"
                        onClick={() => selectEntity(createPointEntityId(
                          selectedEntity.entity.pointAId
                        ))}
                      >
                        {i18n.point(selectedEntity.entity.pointAId)}
                      </button>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblTo')}</span>
                      <button
                        type="button"
                        className="chart-page__entity-link"
                        onClick={() => selectEntity(createPointEntityId(
                          selectedEntity.entity.pointBId
                        ))}
                      >
                        {i18n.point(selectedEntity.entity.pointBId)}
                      </button>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblExactAngle')}</span>
                      <strong>{formatDegree(selectedEntity.entity.exactAngle)}°</strong>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblActualAngle')}</span>
                      <strong>{formatDegree(selectedEntity.entity.actualAngle)}°</strong>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblOrb')}</span>
                      <strong>{formatOrb(selectedEntity.entity.orb)}°</strong>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblEffectiveOrb')}</span>
                      <strong>
                        {formatOrb(getEffectiveAspectOrb(
                          selectedEntity.entity,
                          aspectSettings
                        ))}°
                      </strong>
                    </div>
                  </div>
                )}

                {selectedEntity.type === 'house' && (
                  <div className="chart-page__selection-body">
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblHouseLayer')}</span>
                      <strong>{selectedEntity.entity.number}</strong>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblLongitude')}</span>
                      <strong>{formatDegree(selectedEntity.entity.cuspLongitude)}°</strong>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblZodiacLayer')}</span>
                      <strong>{i18n.sign(selectedEntity.entity.signId)}</strong>
                    </div>
                    <div className="chart-page__selection-row">
                      <span>{i18n.ui('lblSize')}</span>
                      <strong>{formatDegree(selectedEntity.entity.size)}°</strong>
                    </div>
                    <div className="chart-page__selection-stack">
                      <span>{i18n.ui('lblContains')}</span>
                      {getHousePoints(selectedEntity.entity.number).map((point) => (
                        <button
                          key={point.entityId}
                          type="button"
                          className="chart-page__entity-chip"
                          onClick={() => selectEntity(point.entityId)}
                        >
                          {i18n.point(point.id)} · {getPointPositionLabel(point, i18n)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            )}
          </div>
        </section>
      </section>

      {isAspectSettingsOpen && (
        <div
          className="chart-page__dialog-backdrop"
          role="presentation"
          onMouseDown={() => setIsAspectSettingsOpen(false)}
        >
          <section
            className="chart-page__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="aspect-settings-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="chart-page__dialog-header">
              <div>
                <h2 id="aspect-settings-title">
                  {i18n.ui('lblAspectSettings')}
                </h2>
                <p>{i18n.ui('lblAspectSettingsNote')}</p>
              </div>

              <button
                type="button"
                className="chart-page__icon-button"
                aria-label={i18n.ui('lblClose')}
                onClick={() => setIsAspectSettingsOpen(false)}
              >
                x
              </button>
            </header>

            <div className="chart-page__dialog-grid">
              <section className="chart-page__settings-section">
                <div className="chart-page__section-head">
                  <h3>{i18n.ui('lblAspectTypes')}</h3>
                  <button
                    type="button"
                    onClick={resetAspectSettings}
                    className="chart-page__text-button"
                  >
                    {i18n.ui('lblReset')}
                  </button>
                </div>

                <div className="chart-page__aspect-settings-list">
                  {ASPECT_TYPES.map((aspectType) => (
                    <label
                      key={aspectType}
                      className="chart-page__aspect-setting"
                    >
                      <input
                        type="checkbox"
                        checked={aspectSettings.enabledTypes[aspectType]}
                        onChange={(event) => updateAspectType(
                          aspectType,
                          event.target.checked
                        )}
                      />
                      <span>{i18n.aspect(aspectType)}</span>
                      <input
                        type="number"
                        min="0"
                        max={DEFAULT_ASPECT_ORBS[aspectType]}
                        step="0.1"
                        value={aspectSettings.orbs[aspectType]}
                        onChange={(event) => updateAspectOrb(
                          aspectType,
                          event.target.value
                        )}
                        className="chart-page__orb-input"
                        aria-label={i18n.message('aspectOrbLabel', {
                          aspectType
                        })}
                      />
                      <strong>°</strong>
                    </label>
                  ))}
                </div>
              </section>

              <section className="chart-page__settings-section">
                <div className="chart-page__section-head">
                  <h3>{i18n.ui('lblAspectPoints')}</h3>
                  <button
                    type="button"
                    onClick={selectAllAspectPoints}
                    className="chart-page__text-button"
                  >
                    {i18n.ui('lblSelectAll')}
                  </button>
                </div>

                <div className="chart-page__point-filter-list">
                  {aspectPointIds.map((pointId) => (
                    <label
                      key={pointId}
                      className="chart-page__point-filter"
                    >
                      <input
                        type="checkbox"
                        checked={enabledPointIds.includes(pointId)}
                        onChange={(event) => updateAspectPoint(
                          pointId,
                          event.target.checked
                        )}
                      />
                      <span>{i18n.point(pointId)}</span>
                      <input
                        type="number"
                        min="-8"
                        max="8"
                        step="0.5"
                        value={aspectSettings.pointModifiers[pointId] ?? 0}
                        onChange={(event) => updatePointOrbModifier(
                          pointId,
                          event.target.value
                        )}
                        className="chart-page__modifier-input"
                        aria-label={i18n.message('pointOrbModifierLabel', {
                          pointId
                        })}
                      />
                      <strong>°</strong>
                    </label>
                  ))}

                  {!chartModel && (
                    <p className="chart-page__settings-empty">
                      {i18n.ui('lblNoAspectsYet')}
                    </p>
                  )}
                </div>
              </section>
            </div>

            <footer className="chart-page__dialog-actions">
              <span>
                {i18n.message('visibleAspectsLabel', {
                  count: renderedChartModel?.aspects.length ?? 0
                })}
              </span>
              <button
                type="button"
                className="chart-page__button chart-page__button--primary"
                onClick={() => setIsAspectSettingsOpen(false)}
              >
                {i18n.ui('lblDone')}
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  )
}
