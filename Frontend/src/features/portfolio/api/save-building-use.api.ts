import { use } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import { getBuildingUsesQueryOptions } from "@/features/portfolio/api/get-building-uses.api"
import type { BuildingUse } from "@/features/portfolio/models/building-use.models"

function useBuildingUseInvalidation() {
  const queryClient = useQueryClient()
  const { buildingUseService } = use(Services)
  return async (use: BuildingUse) => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getBuildingUsesQueryOptions({
          input: { propertyId: use.propertyId },
          buildingUseService,
        }).queryKey,
      }),
      queryClient.invalidateQueries({ queryKey: ["Properties"] }),
    ])
  }
}

export function useCreateBuildingUse() {
  const { buildingUseService } = use(Services)
  const onSuccess = useBuildingUseInvalidation()
  return useMutation({
    mutationFn: buildingUseService.createBuildingUse,
    onSuccess,
  })
}

export function useUpdateBuildingUse() {
  const { buildingUseService } = use(Services)
  const onSuccess = useBuildingUseInvalidation()
  return useMutation({
    mutationFn: buildingUseService.updateBuildingUse,
    onSuccess,
  })
}
