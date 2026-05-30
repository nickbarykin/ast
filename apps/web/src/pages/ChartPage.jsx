import { useState } from 'react'

import { getChart } from '../services/api'

import NatalChart from '../components/chart/NatalChart'

export default function ChartPage() {
  const [chart, setChart] = useState(null)

  async function handleLoadChart() {
    try {
      const data = await getChart({
        date: '1991-04-11',
        time: '06:45',
        lat: 48.30,
        lon: 37.26,
        timezone: 'Europe/Moscow'
      })

      setChart(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleLoadChart}>
        Load chart
      </button>

      {chart && (
        <>
          <NatalChart chart={chart} />

          <pre>
            {JSON.stringify(chart, null, 2)}
          </pre>
        </>
      )}
    </div>
  )
}