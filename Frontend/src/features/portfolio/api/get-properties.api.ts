import { Services } from "@/context/services.context"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import type { QueryConfig } from "@/lib/react-query"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { use } from "react"

export const getPropertiesQueryOptions = ({
  page,
  propertyService,
}: {
  page?: number
  propertyService: PropertyService
}) => {
  return queryOptions({
    queryKey: page ? ["Properties", { page }] : ["Properties"],
    queryFn: () => propertyService.getProperties(),
  })
}

type UsePropertiesOptions = {
  page?: number
  queryConfig?: QueryConfig<typeof getPropertiesQueryOptions>
}

export const useProperties = ({ queryConfig, page }: UsePropertiesOptions) => {
  const { propertyService } = use(Services)
  return useQuery({
    ...getPropertiesQueryOptions({ page, propertyService }),
    ...queryConfig,
  })
}
