import { useAuth } from "@workos-inc/authkit-react"
import type { Services } from "@/context/services.context"
import { useAuthService } from "@/features/auth/infrastructure/auth.service"
import { User } from "@/features/portfolio/models/user.models"
import { usePortfolioTestServices } from "@/testing/hooks/use-portfolio-test-services"

export function useServices(): Services {
  const authService = useAuthService()

  const { user } = useAuth()

  const owner = user
    ? User.parse({
        ...user,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
      })
    : undefined

  const portfolioServices = usePortfolioTestServices({ authService, owner })

  return { authService, ...portfolioServices }
}
