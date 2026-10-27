import z from "zod"
import { PropertyId } from "@/features/portfolio/models/property.models"

export const PortfolioMonthlyPerformance = z.object({
  month: z.iso.date(),
  siteEnergyKbtu: z.number().nonnegative(),
  sourceEnergyKbtu: z.number().nonnegative(),
  energyStarScore: z.number().min(0).max(100),
})
export type PortfolioMonthlyPerformance = z.infer<
  typeof PortfolioMonthlyPerformance
>

export const PortfolioPropertyPerformance = z
  .object({
    propertyId: PropertyId,
    floorAreaSqFt: z.number().positive().nullable(),
    meterCount: z.number().int().nonnegative(),
    currentMeterCount: z.number().int().nonnegative(),
    reportReady: z.boolean(),
    monthlyPerformance: z.array(PortfolioMonthlyPerformance),
  })
  .refine((property) => property.currentMeterCount <= property.meterCount, {
    message: "Current meter count cannot exceed total meter count",
    path: ["currentMeterCount"],
  })
export type PortfolioPropertyPerformance = z.infer<
  typeof PortfolioPropertyPerformance
>

export const PortfolioPerformance = z.object({
  simulated: z.literal(true),
  asOf: z.iso.date(),
  properties: z.array(PortfolioPropertyPerformance),
})
export type PortfolioPerformance = z.infer<typeof PortfolioPerformance>
