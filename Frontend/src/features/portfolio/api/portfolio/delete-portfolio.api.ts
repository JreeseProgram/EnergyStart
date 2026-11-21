import { reconcileAfterDeletion } from "@/features/portfolio/api/portfolio/deletion-cache"
import { deletePortfolioRecord } from "@/features/portfolio/api/portfolio/delete-portfolio-record"
import type { PortfolioDeletion } from "@/features/portfolio/api/portfolio/deletion.types"
export type { PortfolioDeletion } from "@/features/portfolio/api/portfolio/deletion.types"
import { use } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { Services } from "@/context/services.context"
import { paths } from "@/config/paths"

export function useDeletePortfolioRecord() {
  const services = use(Services)
  const client = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    retry: false,
    mutationFn: (input: PortfolioDeletion) =>
      deletePortfolioRecord(input, {
        deleteRecord: async (record) => {
          switch (record.kind) {
            case "meter":
              await services.energyMeterService.deleteEnergyMeter(record)
              break
            case "reading":
              await services.energyMeterService.deleteEnergyReading(record)
              break
            case "building use":
              await services.buildingUseService.deleteBuildingUse(record)
              break
            case "property":
              await services.propertyService.deleteProperty(record)
              break
          }
        },
        navigateAway: () =>
          navigate(paths.app.properties.getHref(), {
            replace: true,
            flushSync: true,
          }),
        reconcile: (record) => reconcileAfterDeletion(client, record),
      }),
  })
}
