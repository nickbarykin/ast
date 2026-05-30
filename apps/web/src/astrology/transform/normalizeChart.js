export function normalizeChart(rawChart) {
  return {

    planets: Object
      .entries(rawChart.planets)
      .map(([id, planet]) => ({
        id,
        longitude: planet.longitude
      })),

    houses: rawChart.houses.house,

    ascendant:
      rawChart.houses.ascendant
  }
}