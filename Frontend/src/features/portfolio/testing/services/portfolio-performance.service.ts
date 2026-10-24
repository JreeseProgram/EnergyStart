import { PortfolioPerformance } from "@/features/portfolio/models/portfolio-performance.models"
import {
  GetPortfolioPerformanceInput,
  type PortfolioPerformanceService,
} from "@/features/portfolio/services/portfolio-performance.service"
import { delay } from "@/utils/delay"

// Standalone dashboard fixtures, not real meter readings or official report calculations.
// IDs match the existing property fixtures. Unknown/new properties have no performance data.
const fixtures = [
  {
    propertyId: "a0ed477e-df48-4e5a-9c79-2323c5df5301",
    floorAreaSqFt: 125000,
    annualSiteEnergyKbtu: 6875000,
    score: 86,
    current: true,
    ready: true,
  },
  {
    propertyId: "a0ed477e-df48-4e5a-9c79-2323c5df5302",
    floorAreaSqFt: 32000,
    annualSiteEnergyKbtu: 2720000,
    score: 50,
    current: false,
    ready: false,
  },
  {
    propertyId: "a0ed477e-df48-4e5a-9c79-2323c5df5303",
    floorAreaSqFt: 98000,
    annualSiteEnergyKbtu: 3920000,
    score: 91,
    current: true,
    ready: true,
  },
  {
    propertyId: "a0ed477e-df48-4e5a-9c79-2323c5df5304",
    floorAreaSqFt: 210000,
    annualSiteEnergyKbtu: 18900000,
    score: 24,
    current: true,
    ready: true,
  },
]
const seasonalWeights = [
  1.15, 1.05, 0.95, 0.85, 0.9, 1.1, 1.2, 1.2, 1.05, 0.9, 0.8, 0.85,
]
const annualWeight = seasonalWeights.reduce((sum, weight) => sum + weight, 0)

export function usePortfolioPerformanceService(): PortfolioPerformanceService {
  return {
    getPortfolioPerformance: async (input) => {
      const { propertyIds, asOf } = GetPortfolioPerformanceInput.parse(input)
      await delay(300)
      const referenceDate = new Date(`${asOf}T00:00:00.000Z`)
      const firstCurrentYearMonth = Date.UTC(
        referenceDate.getUTCFullYear(),
        referenceDate.getUTCMonth() - 12,
        1
      )

      return PortfolioPerformance.parse({
        simulated: true,
        asOf,
        properties: [...new Set(propertyIds)].map((propertyId) => {
          const fixture = fixtures.find(
            (item) => item.propertyId === propertyId
          )
          if (!fixture)
            return {
              propertyId,
              floorAreaSqFt: null,
              meterCount: 0,
              currentMeterCount: 0,
              reportReady: false,
              monthlyPerformance: [],
            }
          return {
            propertyId,
            floorAreaSqFt: fixture.floorAreaSqFt,
            meterCount: 1,
            currentMeterCount: fixture.current ? 1 : 0,
            reportReady: fixture.ready,
            // Twenty-four completed months support 3/6/12-month ranges and prior-year comparisons.
            monthlyPerformance: Array.from({ length: 24 }, (_, index) => {
              const month = new Date(
                Date.UTC(
                  referenceDate.getUTCFullYear(),
                  referenceDate.getUTCMonth() - 24 + index,
                  1
                )
              )
              const priorYearFactor =
                month.getTime() < firstCurrentYearMonth ? 1.08 : 1
              const siteEnergyKbtu = Math.round(
                ((fixture.annualSiteEnergyKbtu *
                  seasonalWeights[month.getUTCMonth()]) /
                  annualWeight) *
                  priorYearFactor
              )
              return {
                month: month.toISOString().slice(0, 10),
                siteEnergyKbtu,
                sourceEnergyKbtu: Math.round(siteEnergyKbtu * 2.2),
                energyStarScore:
                  month.getTime() < firstCurrentYearMonth
                    ? Math.max(0, fixture.score - 3)
                    : fixture.score,
              }
            }),
          }
        }),
      })
    },
  }
}
