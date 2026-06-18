// src/pages/ChartPage.jsx

import { useMemo, useState } from 'react'

import NatalChartRenderer from '../components/chart/NatalChartRenderer'
import ChartHintCard from '../components/chart/ChartHintCard'
import { buildNatalLayout } from '../astrology/layout/buildNatalLayout'
import { RING_ID } from '../astrology/layout/rings'
import { fetchNormalizedChartData } from '../services/api/chartApi'
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

const DEFAULT_RING_OPTIONS = {
  [RING_ID.HOUSES]: {
    innerRadius: 180,
    outerRadius: 260
  }
}

function formatDegree(value) {
  return value.toFixed(2)
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function ChartPage() {
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

  const layout = useMemo(() => {
    if (!chartModel) {
      return null
    }

    return buildNatalLayout(chartModel, {
      width: CHART_SIZE,
      height: CHART_SIZE,
      rings: ringOptions
    })
  }, [chartModel, ringOptions])

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
      aspectsCount: chartModel.aspects.length
    }
  }, [chartModel])

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

  function useBrowserTimezone() {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    updateField('timezone', browserTimezone)
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

  return (
    <main className="chart-page">
      <section className="chart-page__workspace">
        <aside className="chart-page__sidebar">
          <header className="chart-page__header">
            <h1 className="chart-page__title">Natal Chart</h1>
            <div className={`chart-page__status chart-page__status--${status}`}>
              {status}
            </div>
          </header>

          <form onSubmit={handleSubmit} className="chart-page__form">
            <label className="chart-page__field">
              <span className="chart-page__label">Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => updateField('date', event.target.value)}
                className="chart-page__input"
              />
            </label>

            <label className="chart-page__field">
              <span className="chart-page__label">Time</span>
              <input
                type="time"
                value={form.time}
                onChange={(event) => updateField('time', event.target.value)}
                className="chart-page__input"
              />
            </label>

            <label className="chart-page__field">
              <span className="chart-page__label">Latitude</span>
              <input
                type="number"
                step="0.000001"
                value={form.lat}
                onChange={(event) => updateField('lat', event.target.value)}
                className="chart-page__input"
              />
            </label>

            <label className="chart-page__field">
              <span className="chart-page__label">Longitude</span>
              <input
                type="number"
                step="0.000001"
                value={form.lon}
                onChange={(event) => updateField('lon', event.target.value)}
                className="chart-page__input"
              />
            </label>

            <label className="chart-page__field chart-page__field--wide">
              <span className="chart-page__label">Timezone</span>
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
                Calculate
              </button>

              <button
                type="button"
                onClick={useBrowserTimezone}
                className="chart-page__button"
              >
                Browser TZ
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
                <span>JD</span>
                <strong>{chartSummary.julianDay.toFixed(5)}</strong>
              </div>
              <div>
                <span>ASC</span>
                <strong>
                  {formatDegree(chartSummary.ascendant.longitude)}°{' '}
                  {chartSummary.ascendant.signId}
                </strong>
              </div>
              <div>
                <span>Sun</span>
                <strong>
                  {formatDegree(chartSummary.sun.longitude)}°{' '}
                  {chartSummary.sun.signId}
                </strong>
              </div>
              <div>
                <span>Moon</span>
                <strong>
                  {formatDegree(chartSummary.moon.longitude)}°{' '}
                  {chartSummary.moon.signId}
                </strong>
              </div>
              <div>
                <span>Houses</span>
                <strong>{chartSummary.housesCount}</strong>
              </div>
              <div>
                <span>Aspects</span>
                <strong>{chartSummary.aspectsCount}</strong>
              </div>
            </section>
          )}

          <section className="chart-page__layout-panel">
            <div className="chart-page__section-head">
              <h2 className="chart-page__subtitle">Layout</h2>
              <button
                type="button"
                onClick={resetLayout}
                className="chart-page__text-button"
              >
                Reset
              </button>
            </div>

            <div className="chart-page__layout-readout">
              <div>
                <span>House inner</span>
                <strong>{Math.round(houseRing.innerRadius)}</strong>
              </div>
              <div>
                <span>House outer</span>
                <strong>{Math.round(houseRing.outerRadius)}</strong>
              </div>
            </div>
          </section>
        </aside>

        <section className="chart-page__stage">
          <div className="chart-page__chart">
            {layout ? (
              <>
                <NatalChartRenderer
                  layout={layout}
                  handlers={{
                    onNodeEnter: handleNodeEnter,
                    onNodeMove: handleNodeMove,
                    onNodeLeave: handleNodeLeave
                  }}
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
                  position={hintPosition}
                  mode={hintMode}
                  fixedPosition={{ x: 16, y: 16 }}
                  offset={{ x: 14, y: 14 }}
                />

              </>
            ) : (
              <div className="chart-page__empty">
                <span>Ready</span>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}
