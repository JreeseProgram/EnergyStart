import { portfolioKeys } from "@/features/portfolio/api/query-keys"
import { use } from "react"
import { Services } from "@/context/services.context"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PropertyShareRefreshError } from "@/features/portfolio/services/property.service"

export function useAddPropertyUser() {
  const { propertyService } = use(Services)

  const queryClient = useQueryClient()

  const invalidateProperties = () =>
    queryClient.invalidateQueries(
      { queryKey: portfolioKeys.properties.all },
      { throwOnError: false }
    )

  return useMutation({
    mutationFn: propertyService.addPropertyUser,
    retry: false,
    onSuccess: invalidateProperties,
    onError: async (error) => {
      if (error instanceof PropertyShareRefreshError) {
        await invalidateProperties()
      }
    },
  })
}
