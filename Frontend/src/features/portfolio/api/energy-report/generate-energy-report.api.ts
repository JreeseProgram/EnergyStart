import { portfolioKeys } from "@/features/portfolio/api/query-keys"
import { use } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Services } from "@/context/services.context"

export function useGenerateEnergyReport() {
  const { energyReportService } = use(Services)
  const client = useQueryClient()
  return useMutation({
    mutationFn: energyReportService.getEnergyReport,
    onSuccess: async (report) => {
      await client.invalidateQueries({
        queryKey: portfolioKeys.reports(report.PropertyId),
      })
    },
  })
}
