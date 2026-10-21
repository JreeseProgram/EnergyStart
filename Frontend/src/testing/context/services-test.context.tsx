import { usePortfolioPerformanceService } from "@/features/portfolio/testing/services/portfolio-performance.service"
import {
  BaseServicesProvider,
  type ServicesProviderProps,
} from "@/context/services.context"
import { useAuthService } from "@/features/auth/testing/services/auth.service"
import { useBuildingService } from "@/features/portfolio/testing/services/building.service"
import { useEnergyMeterService } from "@/features/portfolio/testing/services/energy-meter.service"
import { usePropertyService } from "@/features/portfolio/testing/services/property.service"

export function ServicesProvider(
  props: Omit<ServicesProviderProps, "services">
) {
  const authService = useAuthService()
  const propertyService = usePropertyService()
  const buildingService = useBuildingService()
  const energyMeterService = useEnergyMeterService()
  const portfolioPerformanceService = usePortfolioPerformanceService()

  return (
    <BaseServicesProvider
      services={{
        authService,
        propertyService,
        buildingService,
        energyMeterService,
        portfolioPerformanceService,
        // ... additional services go here
      }}
      {...props}
    />
  )
}
