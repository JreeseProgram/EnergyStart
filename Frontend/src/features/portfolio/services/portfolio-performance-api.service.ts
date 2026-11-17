import z from "zod"
import { api } from "@/lib/api-client"
import { PortfolioPerformance } from "@/features/portfolio/models/portfolio-performance.models"
import {
  GetPortfolioPerformanceInput,
  type PortfolioPerformanceService,
} from "@/features/portfolio/services/portfolio-performance.service"

const PerformanceReport = z.object({
  snapshot: z.object({
    floorAreaSqFt: z.number().int().nonnegative(),
    monthlyPerformance: z.array(
      z.object({
        month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
        siteEnergyKbtu: z.number().nonnegative(),
        sourceEnergyKbtu: z.number().nonnegative(),
      })
    ),
  }),
})

export class PortfolioPerformanceApiService implements PortfolioPerformanceService {
  async getPortfolioPerformance(
    input: GetPortfolioPerformanceInput
  ): Promise<PortfolioPerformance> {
    const { propertyIds, asOf } = GetPortfolioPerformanceInput.parse(input)
    const monthBefore = (offset: number) => {
      const date = new Date(`${asOf}T00:00:00.000Z`)
      date.setUTCDate(1)
      date.setUTCMonth(date.getUTCMonth() - offset)
      return date.toISOString().slice(0, 7)
    }

    const params = { startDate: monthBefore(24), endDate: monthBefore(1) }

    const properties = await Promise.all(
      [...new Set(propertyIds)].map(async (propertyId) => {
        const response = await api.get<unknown, unknown>(
          `/energyStatisticReport/${encodeURIComponent(propertyId)}`,
          { params }
        )
        const { snapshot } = PerformanceReport.parse(response)
        const floorAreaSqFt = snapshot.floorAreaSqFt || null

        return {
          propertyId,
          floorAreaSqFt,
          meterCount: null,
          currentMeterCount: null,
          reportReady: null,
          monthlyPerformance:
            floorAreaSqFt === null
              ? []
              : snapshot.monthlyPerformance.map((point) => ({
                  month: `${point.month}-01`,
                  // The backend returns EUI in these fields despite their kBtu names.
                  // Convert to energy so consumers divide by floor area only once.
                  siteEnergyKbtu: point.siteEnergyKbtu * floorAreaSqFt,
                  sourceEnergyKbtu: point.sourceEnergyKbtu * floorAreaSqFt,
                  energyStarScore: null,
                })),
        }
      })
    )

    return PortfolioPerformance.parse({ asOf, properties })
  }
}
