import { use } from "react"
import { Services } from "@/context/services.context"
import { useMutation } from "@tanstack/react-query"
import { BuildingUseSaveRefreshError } from "@/features/portfolio/services/building-use.service"
import { useBuildingUseInvalidation } from "@/features/portfolio/api/building-use/building-use-invalidation.api"

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
