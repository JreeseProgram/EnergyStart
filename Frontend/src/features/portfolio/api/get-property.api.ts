import { Services } from "@/context/services.context"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import type { QueryConfig } from "@/lib/react-query"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { use } from "react"

export const getPropertyQueryOptions = ({
  propertyId,
  propertyService,
}: {
  propertyId: PropertyId
  propertyService: PropertyService
}) => {
  return queryOptions({
    queryKey: ["Properties", { propertyId }],
    queryFn: () => propertyService.getProperty({ propertyId }),
  })
}

type UsePropertiesOptions = {
  propertyId: PropertyId
  queryConfig?: QueryConfig<typeof getPropertyQueryOptions>
}

export const useProperty = ({
  queryConfig,
  propertyId,
}: UsePropertiesOptions) => {
  const { propertyService } = use(Services)
  return useQuery({
    ...getPropertyQueryOptions({ propertyId, propertyService }),
    ...queryConfig,
  })
}
