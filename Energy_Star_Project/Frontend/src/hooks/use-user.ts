import { queryOptions, useQuery } from "@tanstack/react-query"

import type { QueryConfig } from "@/lib/react-query"
import { use } from "react"
import { Services } from "@/context/services.context"

export const useUserQueryOptions = ({
  authService,
}: Pick<Services, "authService">) => {
  return queryOptions({
    queryKey: ["User"],
    queryFn: () => authService.getCurrentUser(),
  })
}

type UseUserOptions = {
  queryConfig?: QueryConfig<typeof useUserQueryOptions>
}

export const useUser = ({ queryConfig }: UseUserOptions = {}) => {
  const { authService } = use(Services)

  return useQuery({
    ...useUserQueryOptions({ authService }),
    ...queryConfig,
  })
}
