import { use } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import { getBuildingUsesQueryOptions } from "@/features/portfolio/api/get-building-uses.api"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { BuildingUseSaveRefreshError } from "@/features/portfolio/services/building-use.service"

function useBuildingUseInvalidation() {
  const queryClient = useQueryClient()
  const { buildingUseService } = use(Services)

  return async (propertyId: PropertyId) => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getBuildingUsesQueryOptions({
          input: { propertyId },
          buildingUseService,
        }).queryKey,
      }),
      queryClient.invalidateQueries({ queryKey: ["Properties"] }),
    ])
  }
}

export function useCreateBuildingUse() {
  const { buildingUseService } = use(Services)
  const invalidate = useBuildingUseInvalidation()

  return useMutation({
    mutationFn: buildingUseService.createBuildingUse,
    retry: false,
    onSuccess: (use) => invalidate(use.propertyId),
    onError: async (error) => {
      if (error instanceof BuildingUseSaveRefreshError) {
        await invalidate(error.propertyId)
      }
    },
  })
}

export function useUpdateBuildingUse() {
  const { buildingUseService } = use(Services)
  const invalidate = useBuildingUseInvalidation()

  return useMutation({
    mutationFn: buildingUseService.updateBuildingUse,
    retry: false,
    onSuccess: (use) => invalidate(use.propertyId),
    onError: async (error) => {
      if (error instanceof BuildingUseSaveRefreshError) {
        await invalidate(error.propertyId)
      }
    },
  })
}
