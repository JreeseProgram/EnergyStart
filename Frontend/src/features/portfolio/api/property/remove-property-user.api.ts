import { portfolioKeys } from "@/features/portfolio/api/query-keys"
import { use } from "react"
import { Services } from "@/context/services.context"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { paths } from "@/config/paths"
import { usePortfolioUser } from "@/features/portfolio/api/user/get-user.api"

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
        const queryKey = portfolioKeys.properties.detail(propertyId)
        await queryClient.cancelQueries({ queryKey })
        queryClient.removeQueries({ queryKey })
      }
      await queryClient.invalidateQueries(
        { queryKey: portfolioKeys.properties.all },
        { throwOnError: false }
      )
    },
  })
}
