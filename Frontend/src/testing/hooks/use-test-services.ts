import type { Services } from "@/context/services.context"
import { useAuthService } from "@/features/auth/testing/services/auth.service"
import { usePortfolioTestServices } from "@/testing/hooks/use-portfolio-test-services"

export function useTestServices(): Services {
  const authService = useAuthService()
  const portfolioServices = usePortfolioTestServices({ authService })

  return { authService, ...portfolioServices }
}
