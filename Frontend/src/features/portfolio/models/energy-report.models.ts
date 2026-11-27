import z from "zod"
import { PropertyId } from "@/features/portfolio/models/property.models"

export const EnergyReportId = z.uuid().brand("EnergyReportId")
export type EnergyReportId = z.infer<typeof EnergyReportId>
export const EnergyReportMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Select a valid month")

// Java LocalDateTime carries no timezone; preserve the backend's value.
const localDateTime = z.iso.datetime({ local: true })

export const EnergyReport = z.object({
  id: EnergyReportId,
  PropertyId: PropertyId,
  startMonth: EnergyReportMonth,
  endMonth: EnergyReportMonth,
  generatedAt: localDateTime,
  aggregateSiteEUI: z.number(),
  aggregateSourceEUI: z.number(),
  energyScore: z.number().int().nullable(),
  disqualifiers: z.array(z.string()),
  propertySnapshot: z.object({
    name: z.string().nullable(),
    streetAddress: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    zip: z.string().nullable(),
  }),
  snapshot: z.object({
    version: z.string(),
    asOf: localDateTime,
    floorAreaSqFt: z.number().int().nonnegative(),
    monthlyPerformance: z.array(
      z.object({
        month: EnergyReportMonth,
        // Preserve DTO values: these fields currently contain EUI.
        siteEnergyKbtu: z.number(),
        sourceEnergyKbtu: z.number(),
      })
    ),
  }),
})
export type EnergyReport = z.infer<typeof EnergyReport>
