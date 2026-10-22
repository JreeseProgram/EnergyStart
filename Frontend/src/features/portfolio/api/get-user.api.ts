import { Services } from "@/context/services.context"
import { User } from "@/features/portfolio/models/user.models"
import { useQuery } from "@tanstack/react-query"

import { use } from "react"

export const usePortfolioUser = () => {
  const { authService } = use(Services)

  return useQuery({
    queryKey: ["User"],
    queryFn: async () => {
      const user = await authService.getCurrentUser()
      return User.parse(user)
    },
    enabled: !authService.isLoading,
  })
}
