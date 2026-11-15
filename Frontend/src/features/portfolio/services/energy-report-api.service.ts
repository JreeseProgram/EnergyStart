import { api } from "@/lib/api-client"
import { EnergyReport } from "@/features/portfolio/models/energy-report.models"
import {
  GetEnergyReportInput,
  GetEnergyReportsInput,
  type EnergyReportService,
} from "@/features/portfolio/services/energy-report.service"

export class EnergyReportApiService implements EnergyReportService {
  private reports = new Map<string, EnergyReport>()

  getEnergyReports = async (
    input: GetEnergyReportsInput
  ): Promise<EnergyReport[]> => {
    const { propertyId } = GetEnergyReportsInput.parse(input)
    return [...this.reports.values()]
      .filter((report) => report.PropertyId === propertyId)
      .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
      .map((report) => EnergyReport.parse(report))
  }

  getEnergyReport = async (
    input: GetEnergyReportInput
  ): Promise<EnergyReport> => {
    const { propertyId, startMonth, endMonth } =
      GetEnergyReportInput.parse(input)
    const response = await api.get<unknown, unknown>(
      `/energyStatisticReport/${encodeURIComponent(propertyId)}`,
      { params: { startDate: startMonth, endDate: endMonth } }
    )

    const report = EnergyReport.refine(
      (report) => report.PropertyId === propertyId,
      {
        message: "Report property ID does not match the requested property",
        path: ["PropertyId"],
      }
    )
      .refine((report) => report.startMonth === startMonth, {
        message: "Report start month does not match the requested period",
        path: ["startMonth"],
      })
      .refine((report) => report.endMonth === endMonth, {
        message: "Report end month does not match the requested period",
        path: ["endMonth"],
      })
      .parse(response)
    this.reports.set(report.id, EnergyReport.parse(report))
    return report
  }
}
