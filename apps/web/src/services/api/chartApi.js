// src/services/api/chartApi.js

const API_URL = 'http://localhost:3000'

async function postChart(endpoint, input) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  })

  if (!response.ok) {
    const text = await response.text()

    throw new Error(`Chart API error: ${response.status} ${text}`)
  }

  return response.json()
}

export async function fetchNormalizedChartData(input) {
  return postChart('/api/chart/normalized', input)
}
