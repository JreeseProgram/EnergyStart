import { portfolioKeys } from "@/features/portfolio/api/query-keys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { type MutationConfig } from "@/lib/react-query"
import {
  PropertyCreateRefreshError,
  type PropertyService,
} from "@/features/portfolio/services/property.service"
import { use } from "react"
import { Services } from "@/context/services.context"

type UseCreatePropertyOptions = {
  mutationConfig?: MutationConfig<PropertyService["createProperty"]>
}

export const useCreateProperty = ({
  mutationConfig,
}: UseCreatePropertyOptions = {}) => {
  const queryClient = useQueryClient()
  const { propertyService } = use(Services)

  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  const invalidateProperties = () =>
    queryClient.invalidateQueries(
      { queryKey: portfolioKeys.properties.all },
      { throwOnError: false }
    )

  return useMutation({
    ...restConfig,
    mutationFn: propertyService.createProperty,
    retry: false,
    onSuccess: async (...args) => {
      await invalidateProperties()
      await onSuccess?.(...args)
    },
    onError: async (...args) => {
      if (args[0] instanceof PropertyCreateRefreshError) {
        await invalidateProperties()
      }

      await onError?.(...args)
    },
  })
}
