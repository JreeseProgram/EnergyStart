import { use } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Services } from "@/context/services.context"

export function useGenerateEnergyReport() {
  const { energyReportService } = use(Services)
  const client = useQueryClient()
  return useMutation({
    mutationFn: energyReportService.generateEnergyReport,
    onSuccess: async (report) => {
      client.setQueryData(
        ["EnergyReports", report.propertyId, report.id],
        report
      )
      await client.invalidateQueries({
        queryKey: ["EnergyReports", report.propertyId],
      })
    },
  })
}
