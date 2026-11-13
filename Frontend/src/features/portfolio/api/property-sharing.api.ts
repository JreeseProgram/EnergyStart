import { use } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import { PropertyShareRefreshError } from "@/features/portfolio/services/property.service"
import { getPropertiesQueryOptions } from "@/features/portfolio/api/get-properties.api"

export function useAddPropertyUser() {
  const { propertyService } = use(Services)

  const queryClient = useQueryClient()

  const invalidateProperties = () =>
    queryClient.invalidateQueries(
      { queryKey: getPropertiesQueryOptions({ propertyService }).queryKey },
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
