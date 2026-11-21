import type { PortfolioTestStore } from "@/features/portfolio/testing/portfolio-test-store"
import { useState } from "react"
import { EnergyReport } from "@/features/portfolio/models/energy-report.models"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import type { PortfolioPerformanceService } from "@/features/portfolio/services/portfolio-performance.service"

import {
  GetEnergyReportsInput,
  GetEnergyReportInput,
  type EnergyReportService,
} from "@/features/portfolio/services/energy-report.service"

export function createEnergyReportTestService(
  propertyService: PropertyService,
  performanceService: PortfolioPerformanceService,
  store?: PortfolioTestStore
): EnergyReportService {
  const reports = new Map<string, EnergyReport>()

  store?.onPropertyDeleted.add((propertyId) => {
    for (const [id, report] of reports) {
      if (report.PropertyId === propertyId) reports.delete(id)
    }
  })

  return {
    getEnergyReports: async (input) => {
      const { propertyId } = GetEnergyReportsInput.parse(input)
      return [...reports.values()]
        .filter((report) => report.PropertyId === propertyId)
        .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
        .map((report) => EnergyReport.parse(report))
    },
    getEnergyReport: async (input) => {
      const fields = GetEnergyReportInput.parse(input)
      const property = await propertyService.getProperty({
        propertyId: fields.propertyId,
      })
      if (!property) throw new Error("Property not found.")
      const generatedAt = new Date().toISOString().slice(0, -1)
      const data = await performanceService.getPortfolioPerformance({
        propertyIds: [fields.propertyId],
        asOf: generatedAt.slice(0, 10),
      })
      const history = data.properties.find(
        (item) => item.propertyId === fields.propertyId
      )
      if (!history?.floorAreaSqFt)
        throw new Error(
          "No test performance history is available for this property."
        )
      const points = history.monthlyPerformance.filter(
        (point) =>
          point.month.slice(0, 7) >= fields.startMonth &&
          point.month.slice(0, 7) <= fields.endMonth
      )
      const monthlyPerformance = points.map((point) => ({
        month: point.month.slice(0, 7),
        siteEnergyKbtu: point.siteEnergyKbtu / history.floorAreaSqFt!,
        sourceEnergyKbtu: point.sourceEnergyKbtu / history.floorAreaSqFt!,
      }))
      const report = EnergyReport.parse({
        id: crypto.randomUUID(),
        PropertyId: fields.propertyId,
        startMonth: fields.startMonth,
        endMonth: fields.endMonth,
        generatedAt,
        aggregateSiteEUI: monthlyPerformance.reduce(
          (sum, point) => sum + point.siteEnergyKbtu,
          0
        ),
        aggregateSourceEUI: monthlyPerformance.reduce(
          (sum, point) => sum + point.sourceEnergyKbtu,
          0
        ),
        energyScore: points.at(-1)?.energyStarScore ?? 0,
        disqualifiers: ["Test fixture data; not a backend calculation."],
        propertySnapshot: {
          name: property.name,
          streetAddress: property.streetAddress,
          city: property.city,
          state: property.state,
          zip: property.zip,
        },
        snapshot: {
          version: "test-fixture-v1",
          asOf: generatedAt,
          floorAreaSqFt: history.floorAreaSqFt,
          monthlyPerformance,
        },
      })
      reports.set(report.id, EnergyReport.parse(report))
      return report
    },
  }
}
export function useEnergyReportTestService(
  propertyService: PropertyService,
  performanceService: PortfolioPerformanceService,
  store?: PortfolioTestStore
) {
  const [service] = useState(() =>
    createEnergyReportTestService(propertyService, performanceService, store)
  )
  return service
}
