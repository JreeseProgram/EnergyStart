import { useState } from "react"
import { createPortfolioTestStore } from "@/features/portfolio/testing/portfolio-test-store"
import {
  BaseServicesProvider,
  type ServicesProviderProps,
} from "@/context/services.context"
import { useAuthService } from "@/features/auth/testing/services/auth.service"
import { createPropertyTestService } from "@/features/portfolio/testing/services/property.service"
import { createBuildingUseTestService } from "@/features/portfolio/testing/services/building-use.service"
import { useEnergyMeterTestService } from "@/features/portfolio/testing/services/energy-meter.service"
import { usePortfolioPerformanceService } from "@/features/portfolio/testing/services/portfolio-performance.service"

export function ServicesProvider(
  props: Omit<ServicesProviderProps, "services">
) {
  const authService = useAuthService()
  const [store] = useState(createPortfolioTestStore)
  const propertyService = createPropertyTestService(store)
  const buildingUseService = createBuildingUseTestService(store)
  const energyMeterService = useEnergyMeterTestService(propertyService)
  const portfolioPerformanceService = usePortfolioPerformanceService()

  return (
    <BaseServicesProvider
      services={{
        authService,
        propertyService,
        buildingUseService,
        energyMeterService,
        portfolioPerformanceService,
        // ... additional services go here
      }}
      {...props}
    />
  )
}
