import { useNavigate } from "react-router"
import { paths } from "@/config/paths"
import { usePortfolioUser } from "@/features/portfolio/api/get-user.api"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import { use } from "react"
import {
  queryOptions,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
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

export function getPropertyUsersQueryOptions({
  propertyId,
  propertyService,
}: {
  propertyId: PropertyId
  propertyService: PropertyService
}) {
  return queryOptions({
    queryKey: ["Properties", { propertyId }, "Users"],
    queryFn: () => propertyService.getPropertyUsers({ propertyId }),
  })
}

export function usePropertyUsers(propertyId: PropertyId) {
  const { propertyService } = use(Services)
  return useQuery(getPropertyUsersQueryOptions({ propertyId, propertyService }))
}

export function useRemovePropertyUser() {
  const { propertyService } = use(Services)
  const queryClient = useQueryClient()
  const user = usePortfolioUser()
  const navigate = useNavigate()
  const currentUserId: string | undefined = user.data?.id

  return useMutation({
    mutationFn: propertyService.removePropertyUser,
    retry: false,
    onSuccess: async (_, { propertyId, userId }) => {
      if (userId === currentUserId) {
        // Unmount the property before invalidation can refetch revoked access.
        await navigate(paths.app.properties.getHref(), {
          replace: true,
          flushSync: true,
        })
        const queryKey = ["Properties", { propertyId }]
        await queryClient.cancelQueries({ queryKey })
        queryClient.removeQueries({ queryKey })
      }
      await queryClient.invalidateQueries(
        { queryKey: ["Properties"] },
        { throwOnError: false }
      )
    },
  })
}
