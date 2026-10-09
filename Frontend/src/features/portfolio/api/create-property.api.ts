import { useMutation, useQueryClient } from "@tanstack/react-query"

import { type MutationConfig } from "@/lib/react-query"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import { getPropertiesQueryOptions } from "@/features/portfolio/api/get-properties.api"
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

  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getPropertiesQueryOptions({ propertyService }).queryKey,
      })
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: propertyService.createProperty,
  })
}
