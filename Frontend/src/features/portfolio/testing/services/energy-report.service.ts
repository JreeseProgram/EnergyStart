import { useState } from "react"
import { EnergyReport } from "@/features/portfolio/models/energy-report.models"
import {
  GetEnergyReportsInput,
  GetEnergyReportInput,
  GenerateEnergyReportInput,
  type EnergyReportService,
} from "@/features/portfolio/services/energy-report.service"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import type { PortfolioPerformanceService } from "@/features/portfolio/services/portfolio-performance.service"
import { reportMonths } from "@/features/portfolio/utils/energy-report-labels"
import { delay } from "@/utils/delay"

export function createEnergyReportTestService(
  propertyService: PropertyService,
  performanceService: PortfolioPerformanceService
): EnergyReportService {
  const reports = new Map<string, EnergyReport>()
  async function requireProperty(
    propertyId: GetEnergyReportsInput["propertyId"]
  ) {
    const property = await propertyService.getProperty({ propertyId })
    if (!property) throw new Error("Property not found.")
    return property
  }
  return {
    getEnergyReports: async (input) => {
      await delay(300)
      const { propertyId } = GetEnergyReportsInput.parse(input)
      await requireProperty(propertyId)
      return [...reports.values()]
        .filter((report) => report.propertyId === propertyId)
        .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
        .map((report) => EnergyReport.parse(report))
    },
    getEnergyReport: async (input) => {
      await delay(300)
      const { propertyId, reportId } = GetEnergyReportInput.parse(input)
      await requireProperty(propertyId)
      const report = reports.get(reportId)
      if (!report || report.propertyId !== propertyId)
        throw new Error("Report not found for this property.")
      return EnergyReport.parse(report)
    },
    generateEnergyReport: async (input) => {
      const fields = GenerateEnergyReportInput.parse(input)
      const property = await requireProperty(fields.propertyId)
      const generatedAt = new Date().toISOString()
      const asOf = generatedAt.slice(0, 10)
      const data = await performanceService.getPortfolioPerformance({
        propertyIds: [fields.propertyId],
        asOf,
      })
      const history = data.properties.find(
        (item) => item.propertyId === fields.propertyId
      )
      if (!history?.floorAreaSqFt)
        throw new Error(
          "No simulated performance history is available for this property. A report was not generated."
        )
      const selected = reportMonths(fields.startMonth, fields.endMonth).map(
        (month) =>
          history.monthlyPerformance.find((point) => point.month === month)
      )
      if (selected.some((point) => !point))
        throw new Error(
          "Complete simulated history is not available for this period. Choose completed months within the last 24 months."
        )
      const points = selected.filter((point) => point !== undefined)
      let result: number
      switch (fields.reportType) {
        case "SITE_EUI":
          result =
            points.reduce((sum, point) => sum + point.siteEnergyKbtu, 0) /
            history.floorAreaSqFt
          break
        case "SOURCE_EUI":
          result =
            points.reduce((sum, point) => sum + point.sourceEnergyKbtu, 0) /
            history.floorAreaSqFt
          break
        case "ENERGY_STAR_SCORE":
          result = points[points.length - 1].energyStarScore
          break
      }
      const report = EnergyReport.parse({
        ...fields,
        id: crypto.randomUUID(),
        generatedAt,
        simulated: true,
        result,
        propertySnapshot: {
          name: property.name,
          streetAddress: property.streetAddress,
          city: property.city,
          state: property.state,
          zip: property.zip,
        },
        snapshot: {
          version: "portfolio-prototype-v1",
          asOf,
          floorAreaSqFt: history.floorAreaSqFt,
          monthlyPerformance: points,
        },
      })
      reports.set(report.id, report)
      return EnergyReport.parse(report)
    },
  }
}
export function useEnergyReportTestService(
  propertyService: PropertyService,
  performanceService: PortfolioPerformanceService
) {
  const [service] = useState(() =>
    createEnergyReportTestService(propertyService, performanceService)
  )
  return service
}
