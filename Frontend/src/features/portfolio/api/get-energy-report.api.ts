import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import type { GetEnergyReportInput } from "@/features/portfolio/services/energy-report.service"

export function useEnergyReport(input: GetEnergyReportInput) {
  const { energyReportService } = use(Services)
  return useQuery({
    queryKey: ["EnergyReports", input.propertyId, input.reportId],
    queryFn: () => energyReportService.getEnergyReport(input),
  })
}
