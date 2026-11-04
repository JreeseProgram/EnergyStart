import { use } from "react"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import type { EnergyReportService } from "@/features/portfolio/services/energy-report.service"

export function getEnergyReportsQueryOptions(
  propertyId: PropertyId,
  service: EnergyReportService
) {
  return queryOptions({
    queryKey: ["EnergyReports", propertyId],
    queryFn: () => service.getEnergyReports({ propertyId }),
  })
}
export function useEnergyReports(propertyId: PropertyId) {
  const { energyReportService } = use(Services)
  return useQuery(getEnergyReportsQueryOptions(propertyId, energyReportService))
}
