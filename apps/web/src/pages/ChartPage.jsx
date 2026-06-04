// src/pages/ChartPage.jsx

import { useState } from 'react'

import { fetchChartData } from '../services/api/chartApi'
import {
  createChartModel,
  TIMEZONE_OPTIONS,
  TimezoneId
} from '../astrology/model'

export default function ChartPage() {
  const [form, setForm] = useState({
    date: '1993-11-12',
    time: '14:35',
    lat: '55.75',
    lon: '37.61',
    timezone: TimezoneId.EUROPE_MOSCOW
  })

  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [chartModel, setChartModel] = useState(null)

  function updateField(fieldName, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value
    }))
  }

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
          type: point.type,
          longitude: point.longitude?.toFixed?.(3),
          sign: point.signId,
          degree: point.degreeInSign?.toFixed?.(3),
          house: point.houseNumber,
          angle: point.chartAngle?.toFixed?.(3),
          retrograde: point.isRetrograde
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
          type: aspect.type,
          a: aspect.pointAId,
          b: aspect.pointBId,
          angle: aspect.actualAngle.toFixed(3),
          orb: aspect.orb.toFixed(3)
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
    <main style={styles.page}>
      <section style={styles.panel}>
        <h1 style={styles.title}>Natal Chart Debug</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.field}>
            <span style={styles.label}>Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => updateField('date', event.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Time</span>
            <input
              type="time"
              value={form.time}
              onChange={(event) => updateField('time', event.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Latitude</span>
            <input
              type="number"
              step="0.000001"
              value={form.lat}
              onChange={(event) => updateField('lat', event.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Longitude</span>
            <input
              type="number"
              step="0.000001"
              value={form.lon}
              onChange={(event) => updateField('lon', event.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.fieldWide}>
            <span style={styles.label}>Timezone</span>
            <select
              value={form.timezone}
              onChange={(event) => updateField('timezone', event.target.value)}
              style={styles.input}
            >
              {TIMEZONE_OPTIONS.map((timezone) => (
                <option key={timezone.id} value={timezone.id}>
                  {timezone.label}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" style={styles.button}>
            Calculate chart
          </button>

          <button
            type="button"
            onClick={useBrowserTimezone}
            style={styles.secondaryButton}
          >
            Use browser timezone
          </button>
        </form>

        <div style={styles.status}>
          <strong>Status:</strong> {status}
        </div>

        {error && (
          <pre style={styles.error}>
            {error}
          </pre>
        )}

        {chartModel && (
          <section style={styles.result}>
            <h2 style={styles.subtitle}>Result</h2>

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

            <p style={styles.hint}>
              Full data is printed in browser console.
            </p>
          </section>
        )}
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '32px',
    background: '#111',
    color: '#eee',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
  },

  panel: {
    maxWidth: '760px',
    margin: '0 auto',
    padding: '24px',
    border: '1px solid #333',
    borderRadius: '16px',
    background: '#181818'
  },

  title: {
    margin: '0 0 24px',
    fontSize: '28px'
  },

  subtitle: {
    margin: '0 0 12px',
    fontSize: '20px'
  },

  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px'
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  fieldWide: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  label: {
    fontSize: '13px',
    color: '#aaa'
  },

  input: {
    height: '38px',
    padding: '0 10px',
    border: '1px solid #444',
    borderRadius: '8px',
    background: '#222',
    color: '#fff',
    fontSize: '14px'
  },

  button: {
    gridColumn: '1 / -1',
    height: '42px',
    border: '0',
    borderRadius: '10px',
    background: '#fff',
    color: '#111',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer'
  },

  status: {
    marginTop: '20px',
    color: '#ccc'
  },

  error: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '8px',
    background: '#3a1111',
    color: '#ffb4b4',
    whiteSpace: 'pre-wrap'
  },

  result: {
    marginTop: '24px',
    padding: '16px',
    border: '1px solid #333',
    borderRadius: '12px',
    background: '#202020'
  },

  hint: {
    color: '#999',
    fontSize: '13px'
  }
}