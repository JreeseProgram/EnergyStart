import { portfolioKeys } from "@/features/portfolio/api/query-keys"
import { use } from "react"
import { Services } from "@/context/services.context"
import { useQueryClient } from "@tanstack/react-query"
import { getBuildingUsesQueryOptions } from "@/features/portfolio/api/building-use/get-building-uses.api"
import type { PropertyId } from "@/features/portfolio/models/property.models"

export function useBuildingUseInvalidation() {
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
      queryClient.invalidateQueries({ queryKey: portfolioKeys.properties.all }),
    ])
  }
}
