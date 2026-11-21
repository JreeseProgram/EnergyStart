import z from "zod"
import {
  EnergyReportMonth,
  type EnergyReport,
} from "@/features/portfolio/models/energy-report.models"
import { PropertyId } from "@/features/portfolio/models/property.models"

export interface EnergyReportService {
  getEnergyReports: (input: GetEnergyReportsInput) => Promise<EnergyReport[]>
  getEnergyReport: (input: GetEnergyReportInput) => Promise<EnergyReport>
}

export type EnergyReportPeriod = z.infer<typeof EnergyReportPeriod>
export const EnergyReportPeriod = z
  .object({
    startMonth: EnergyReportMonth,
    endMonth: EnergyReportMonth,
  })
  .refine((input) => input.startMonth <= input.endMonth, {
    message: "End month must be on or after start month",
    path: ["endMonth"],
  })

export type GetEnergyReportInput = z.infer<typeof GetEnergyReportInput>
export const GetEnergyReportInput = EnergyReportPeriod.safeExtend({
  propertyId: PropertyId,
})

export type GetEnergyReportsInput = z.infer<typeof GetEnergyReportsInput>
export const GetEnergyReportsInput = z.object({ propertyId: PropertyId })
