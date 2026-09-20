import { Services } from "@/context/services.context"
import { useQuery } from "@tanstack/react-query"

import { use } from "react"

export const useUser = () => {
  const { authService } = use(Services)

  return useQuery({
    queryKey: ["User"],
    queryFn: authService.getCurrentUser,
    enabled: !authService.isLoading,
  })
}
