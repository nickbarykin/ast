export async function getChart(payload) {
  const response = await fetch('http://localhost:3000/api/chart', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error('Failed to load chart')
  }

  return response.json()
}