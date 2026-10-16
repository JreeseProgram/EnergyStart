import { useMutation, useQueryClient } from "@tanstack/react-query"
import { use } from "react"

import { Services } from "@/context/services.context"
import { getPropertiesQueryOptions } from "@/features/portfolio/api/get-properties.api"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import type { MutationConfig } from "@/lib/react-query"

type UseUpdatePropertyOptions = {
  mutationConfig?: MutationConfig<PropertyService["updateProperty"]>
}

export const useUpdateProperty = ({
  mutationConfig,
}: UseUpdatePropertyOptions = {}) => {
  const queryClient = useQueryClient()
  const { propertyService } = use(Services)
  const { onSuccess, ...restConfig } = mutationConfig || {}

  return useMutation({
    ...restConfig,
    mutationFn: propertyService.updateProperty,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: getPropertiesQueryOptions({ propertyService }).queryKey,
      })
      await onSuccess?.(...args)
    },
  })
}
