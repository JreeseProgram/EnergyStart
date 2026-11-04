import z from "zod"
import {
  EnergyReportFields,
  EnergyReportId,
  type EnergyReport,
} from "@/features/portfolio/models/energy-report.models"
import { PropertyId } from "@/features/portfolio/models/property.models"

export const GetEnergyReportsInput = z.object({ propertyId: PropertyId })
export type GetEnergyReportsInput = z.infer<typeof GetEnergyReportsInput>
export const GetEnergyReportInput = GetEnergyReportsInput.extend({
  reportId: EnergyReportId,
})
export type GetEnergyReportInput = z.infer<typeof GetEnergyReportInput>
export const GenerateEnergyReportInput = EnergyReportFields.safeExtend({
  propertyId: PropertyId,
})
export type GenerateEnergyReportInput = z.infer<
  typeof GenerateEnergyReportInput
>

export interface EnergyReportService {
  getEnergyReports: (input: GetEnergyReportsInput) => Promise<EnergyReport[]>
  getEnergyReport: (input: GetEnergyReportInput) => Promise<EnergyReport>
  generateEnergyReport: (
    input: GenerateEnergyReportInput
  ) => Promise<EnergyReport>
}
