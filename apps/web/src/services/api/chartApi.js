// src/services/api/chartApi.js

const API_URL = 'http://localhost:3000'

export async function fetchChartData(input) {
  const response = await fetch(`${API_URL}/api/chart`, {
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