import z from "zod"
import { PropertyId } from "@/features/portfolio/models/property.models"

export type PortfolioMonthlyPerformance = z.infer<typeof PortfolioMonthlyPerformance>
export const PortfolioMonthlyPerformance = z.object({
  month: z.iso.date(),
  siteEnergyKbtu: z.number().nonnegative(),
  sourceEnergyKbtu: z.number().nonnegative(),
  energyStarScore: z.number().min(0).max(100).nullable(),
})

export type PortfolioPropertyPerformance = z.infer<typeof PortfolioPropertyPerformance>
export const PortfolioPropertyPerformance = z
  .object({
    propertyId: PropertyId,
    floorAreaSqFt: z.number().positive().nullable(),
    meterCount: z.number().int().nonnegative().nullable(),
    currentMeterCount: z.number().int().nonnegative().nullable(),
    reportReady: z.boolean().nullable(),
    monthlyPerformance: z.array(PortfolioMonthlyPerformance),
  })
  .refine(
    (property) =>
      property.currentMeterCount === null ||
      property.meterCount === null ||
      property.currentMeterCount <= property.meterCount,
    {
      message: "Current meter count cannot exceed total meter count",
      path: ["currentMeterCount"],
    }
  )

export type PortfolioPerformance = z.infer<typeof PortfolioPerformance>
export const PortfolioPerformance = z.object({
  asOf: z.iso.date(),
  properties: z.array(PortfolioPropertyPerformance),
})
