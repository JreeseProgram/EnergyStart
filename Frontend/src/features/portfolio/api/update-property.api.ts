import { useMutation, useQueryClient } from "@tanstack/react-query"
import { use } from "react"

import { Services } from "@/context/services.context"
import { getPropertiesQueryOptions } from "@/features/portfolio/api/get-properties.api"
import {
  PropertyUpdateRefreshError,
  type PropertyService,
} from "@/features/portfolio/services/property.service"
import type { MutationConfig } from "@/lib/react-query"

type UseUpdatePropertyOptions = {
  mutationConfig?: MutationConfig<PropertyService["updateProperty"]>
}

export const useUpdateProperty = ({
  mutationConfig,
}: UseUpdatePropertyOptions = {}) => {
  const queryClient = useQueryClient()
  const { propertyService } = use(Services)
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  const invalidateProperties = () =>
    queryClient.invalidateQueries(
      {
        // Prefix matching includes detail and all paginated list queries.
        queryKey: getPropertiesQueryOptions({ propertyService }).queryKey,
      },
      { throwOnError: false }
    )

  return useMutation({
    ...restConfig,
    mutationFn: propertyService.updateProperty,
    retry: false,
    onSuccess: async (...args) => {
      await invalidateProperties()
      await onSuccess?.(...args)
    },
    onError: async (...args) => {
      if (args[0] instanceof PropertyUpdateRefreshError) {
        await invalidateProperties()
      }
      await onError?.(...args)
    },
  })
}
