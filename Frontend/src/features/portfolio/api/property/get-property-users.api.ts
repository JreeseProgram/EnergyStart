import { portfolioKeys } from "@/features/portfolio/api/query-keys"
import { use } from "react"
import { Services } from "@/context/services.context"
import { queryOptions, useQuery } from "@tanstack/react-query"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import type { PropertyService } from "@/features/portfolio/services/property.service"

export function getPropertyUsersQueryOptions({
  propertyId,
  propertyService,
}: {
  propertyId: PropertyId
  propertyService: PropertyService
}) {
  return queryOptions({
    queryKey: portfolioKeys.properties.users(propertyId),
    queryFn: () => propertyService.getPropertyUsers({ propertyId }),
  })
}

export function usePropertyUsers(propertyId: PropertyId) {
  const { propertyService } = use(Services)
  return useQuery(getPropertyUsersQueryOptions({ propertyId, propertyService }))
}
