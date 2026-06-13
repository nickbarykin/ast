export function getAspectTargets(chart) {
  return [
    ...Object.values(chart.points),

    // Считаем только главные углы.
    // DSC и IC не добавляем, чтобы не плодить дубли.
    chart.angles.asc,
    chart.angles.mc,

    // Vertex можно включить, если хочешь аспекты к нему.
    ...Object.values(chart.sensitivePoints)
  ].filter(Boolean);
}