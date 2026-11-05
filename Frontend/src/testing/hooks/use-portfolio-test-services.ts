import { useState } from "react"
import { createPortfolioTestStore } from "@/features/portfolio/testing/portfolio-test-store"
import { createPropertyTestService } from "@/features/portfolio/testing/services/property.service"
import { createBuildingUseTestService } from "@/features/portfolio/testing/services/building-use.service"
import { useEnergyReportTestService } from "@/features/portfolio/testing/services/energy-report.service"
import { useEnergyMeterTestService } from "@/features/portfolio/testing/services/energy-meter.service"
import { User } from "@/features/portfolio/models/user.models"
import type { AuthService } from "@/features/auth/services/auth.service"
import { usePortfolioPerformanceService } from "@/features/portfolio/testing/services/portfolio-performance.service"
import type { Services } from "@/context/services.context"

type PortfolioTestServicesOptions = {
  authService: AuthService
  owner?: User
}

export function usePortfolioTestServices({
  authService,
  owner,
}: PortfolioTestServicesOptions): Omit<Services, "authService"> {
  // SessionProvider remounts the application bundle when the user changes.
  const [store] = useState(() => createPortfolioTestStore(owner))

  const propertyService = createPropertyTestService(store, async () => {
    const user = await authService.getCurrentUser()
    return user ? User.parse(user) : null
  })

  const buildingUseService = createBuildingUseTestService(store)
  const energyMeterService = useEnergyMeterTestService(propertyService)
  const portfolioPerformanceService = usePortfolioPerformanceService()

  const energyReportService = useEnergyReportTestService(
    propertyService,
    portfolioPerformanceService
  )

  return {
    propertyService,
    buildingUseService,
    energyMeterService,
    portfolioPerformanceService,
    energyReportService,
  }
}
