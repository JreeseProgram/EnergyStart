import type {
  PortfolioPerformance,
  PortfolioPropertyPerformance,
} from "@/features/portfolio/models/portfolio-performance.models"

export type PortfolioMetric = "siteEui" | "sourceEui" | "energyStarScore"
export type PortfolioMonths = 3 | 6 | 12
export type PropertyPerformanceMetrics = Record<
  string,
  Record<PortfolioMetric, number | null>
>

function monthsEndingBefore(asOf: string, count: number, offset = 0) {
  const date = new Date(`${asOf}T00:00:00.000Z`)
  return Array.from({ length: count }, (_, index) =>
    new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth() - count - offset + index,
        1
      )
    )
      .toISOString()
      .slice(0, 10)
  )
}

function periodMetrics(
  property: PortfolioPropertyPerformance,
  months: string[]
) {
  const points = months.map((month) =>
    property.monthlyPerformance.find((point) => point.month === month)
  )
  if (!property.floorAreaSqFt || points.some((point) => !point)) return null
  const siteEnergy = points.reduce(
    (sum, point) => sum + point!.siteEnergyKbtu,
    0
  )
  const sourceEnergy = points.reduce(
    (sum, point) => sum + point!.sourceEnergyKbtu,
    0
  )
  return {
    siteEnergy,
    siteEui: siteEnergy / property.floorAreaSqFt,
    sourceEui: sourceEnergy / property.floorAreaSqFt,
    energyStarScore: points.at(-1)!.energyStarScore,
  }
}

export function getPortfolioPerformance(
  data: PortfolioPerformance,
  count: PortfolioMonths
) {
  const months = monthsEndingBefore(data.asOf, count)
  const previousMonths = monthsEndingBefore(data.asOf, count, 12)
  const propertyMetrics: PropertyPerformanceMetrics = {}
  for (const property of data.properties) {
    const metrics = periodMetrics(property, months)
    propertyMetrics[property.propertyId] = {
      siteEui: metrics?.siteEui ?? null,
      sourceEui: metrics?.sourceEui ?? null,
      energyStarScore: metrics?.energyStarScore ?? null,
    }
  }

  const points = months.map((month) => {
    const available = data.properties.flatMap((property) => {
      const point = property.monthlyPerformance.find(
        (item) => item.month === month
      )
      return point && property.floorAreaSqFt
        ? [{ point, area: property.floorAreaSqFt }]
        : []
    })
    const area = available.reduce((sum, item) => sum + item.area, 0)
    const scored = available.filter(
      (item) => item.point.energyStarScore !== null
    )
    const scoredArea = scored.reduce((sum, item) => sum + item.area, 0)
    return {
      month,
      siteEui: area
        ? available.reduce((sum, item) => sum + item.point.siteEnergyKbtu, 0) /
          area
        : null,
      sourceEui: area
        ? available.reduce(
            (sum, item) => sum + item.point.sourceEnergyKbtu,
            0
          ) / area
        : null,
      energyStarScore: scoredArea
        ? scored.reduce(
            (sum, item) => sum + item.point.energyStarScore! * item.area,
            0
          ) / scoredArea
        : null,
    }
  })

  const complete = data.properties.filter((property) =>
    periodMetrics(property, months)
  )
  const aggregate = (metric: PortfolioMetric) => {
    const available = complete.filter(
      (property) => propertyMetrics[property.propertyId][metric] !== null
    )
    const totalArea = available.reduce(
      (sum, property) => sum + property.floorAreaSqFt!,
      0
    )
    return totalArea
      ? available.reduce(
          (sum, property) =>
            sum +
            propertyMetrics[property.propertyId][metric]! *
              property.floorAreaSqFt!,
          0
        ) / totalArea
      : null
  }
  const comparable = complete.flatMap((property) => {
    const previous = periodMetrics(property, previousMonths)
    return previous
      ? [
          {
            current: periodMetrics(property, months)!.siteEnergy,
            previous: previous.siteEnergy,
          },
        ]
      : []
  })
  const priorEnergy = comparable.reduce((sum, item) => sum + item.previous, 0)
  const currentEnergy = comparable.reduce((sum, item) => sum + item.current, 0)

  return {
    points,
    propertyMetrics,
    period: {
      siteEui: aggregate("siteEui"),
      sourceEui: aggregate("sourceEui"),
      energyStarScore: aggregate("energyStarScore"),
    },
    energyChangePercent:
      comparable.length && priorEnergy > 0
        ? ((currentEnergy - priorEnergy) / priorEnergy) * 100
        : null,
    propertiesWithHistory: complete.length,
    currentMeters: sumKnown(
      data.properties.map((property) => property.currentMeterCount)
    ),
    totalMeters: sumKnown(
      data.properties.map((property) => property.meterCount)
    ),
  }
}

function sumKnown(values: (number | null)[]): number | null {
  return values.reduce<number | null>(
    (sum, value) => (sum === null || value === null ? null : sum + value),
    0
  )
}
