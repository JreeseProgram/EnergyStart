import {
  BaseServicesProvider,
  type ServicesProviderProps,
} from "@/context/services.context"
import { useAuthService } from "@/features/auth/testing/services/auth.service"
import { usePropertyTestService } from "@/features/portfolio/testing/services/property.service"
import { useBuildingUseTestService } from "@/features/portfolio/testing/services/building-use.service"
import { useEnergyMeterTestService } from "@/features/portfolio/testing/services/energy-meter.service"
import { usePortfolioPerformanceService } from "@/features/portfolio/testing/services/portfolio-performance.service"

export function ServicesProvider(
  props: Omit<ServicesProviderProps, "services">
) {
  const authService = useAuthService()
  const propertyService = usePropertyTestService()
  const buildingUseService = useBuildingUseTestService(propertyService)
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
