// src/pages/ChartPage.jsx

import { useMemo, useState } from 'react'

import SvgSceneRenderer from '../components/chart/SvgSceneRenderer'
import SceneHintCard from '../components/chart/SceneHintCard'
import { buildNatalScene } from '../astrology/scene/buildNatalScene'
import { fetchChartData } from '../services/api/chartApi'
import './ChartPage.css'
import {
  createChartModel,
  TIMEZONE_OPTIONS,
  TimezoneId
} from '../astrology/model'

export default function ChartPage() {
  const [form, setForm] = useState({
    date: '1991-11-05',
    time: '12:00',
    lat: '56.06',
    lon: '63.35',
    timezone: TimezoneId.ASIA_YEKATERINBURG
  })

  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [chartModel, setChartModel] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [hintPosition, setHintPosition] = useState({ x: 0, y: 0 })
  const [hintMode] = useState('floating')

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

  const scene = useMemo(() => {
    if (!chartModel) {
      return null
    }

    return buildNatalScene(chartModel, {
      width: 600,
      height: 600
    })
  }, [chartModel])

  function useBrowserTimezone() {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    updateField('timezone', browserTimezone)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setStatus('loading')
    setError(null)

    try {
      const input = {
        date: form.date,
        time: form.time,
        lat: Number(form.lat),
        lon: Number(form.lon),
        timezone: form.timezone
      }

      console.log('Chart input:', input)

      const rawChart = await fetchChartData(input)

      console.log('Raw chart from API:', rawChart)

      const model = createChartModel(rawChart)

      console.log('Chart model:', model)

      console.table(
        Object.values(model.points).map((point) => ({
          id: point.id,
          entityId: point.entityId,
          entityType: point.type,
          pointType: point.pointType,
          longitude: point.longitude?.toFixed?.(3),
          sign: point.signId,
          degree: point.degreeInSign?.toFixed?.(3),
          house: point.houseNumber ?? '',
          chartAngle: point.chartAngle?.toFixed?.(3),
          screenAngle: point.screenAngle?.toFixed?.(3),
          retrograde: point.isRetrograde ?? ''
        }))
      )

      console.table(
        model.houses.map((house) => ({
          house: house.number,
          cusp: house.cuspLongitude.toFixed(3),
          next: house.nextCuspLongitude.toFixed(3),
          sign: house.signId,
          degree: house.degreeInSign.toFixed(3),
          size: house.size.toFixed(3)
        }))
      )

      console.table(
        model.aspects.map((aspect) => ({
          id: aspect.id,
          type: aspect.type,
          aspectType: aspect.aspectType,
          a: aspect.pointAId,
          b: aspect.pointBId,
          angle: aspect.actualAngle.toFixed(3),
          orb: aspect.orb.toFixed(3)
        }))
      )

      console.table(
        model.signs.map((sign) => ({
          id: sign.id,
          entityId: sign.entityId,
          index: sign.index,
          start: sign.startLongitude,
          end: sign.endLongitude
        }))
      )

      console.table(
        model.relations.map((relation) => ({
          id: relation.id,
          relationType: relation.relationType,
          source: relation.sourceEntityId,
          target: relation.targetEntityId
        }))
      )

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
      <section className="chart-page__panel">
        <h1 className="chart-page__title">Natal Chart Debug</h1>

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

          <label className="chart-page__field--wide">
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

          <button type="submit" className="chart-page__button">
            Calculate chart
          </button>

          <button
            type="button"
            onClick={useBrowserTimezone}
            className="chart-page__button-secondary"
          >
            Use browser timezone
          </button>
        </form>

        <div className="chart-page__status">
          <strong>Status:</strong> {status}
        </div>

        {error && (
          <pre className="chart-page__error">
            {error}
          </pre>
        )}

        {chartModel && (
          <section className="chart-page__result">
            <h2 className="chart-page__subtitle">Result</h2>

            <p>
              <strong>Julian Day:</strong> {chartModel.meta.julianDay}
            </p>

            <p>
              <strong>ASC:</strong>{' '}
              {chartModel.points.ascendant.longitude.toFixed(3)}°{' '}
              {chartModel.points.ascendant.signId}
            </p>

            <p>
              <strong>Sun:</strong>{' '}
              {chartModel.points.sun.longitude.toFixed(3)}°{' '}
              {chartModel.points.sun.signId}{' '}
              {chartModel.points.sun.degreeInSign.toFixed(3)}°
            </p>

            <p>
              <strong>Houses:</strong> {chartModel.houses.length}
            </p>

            <p>
              <strong>Aspects:</strong> {chartModel.aspects.length}
            </p>

            <p className="chart-page__hint">
              Full data is printed in browser console.
            </p>

            <div className="chart-page__chart">
              <SvgSceneRenderer
                scene={scene}
                onNodeEnter={handleNodeEnter}
                onNodeMove={handleNodeMove}
                onNodeLeave={handleNodeLeave}
              />

              <SceneHintCard
                node={hoveredNode}
                position={hintPosition}
                mode={hintMode}
                fixedPosition={{ x: 16, y: 16 }}
                offset={{ x: 14, y: 14 }}
              />
            </div>
          </section>
        )}
      </section>
    </main>
  )
}