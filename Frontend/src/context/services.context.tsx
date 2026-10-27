import { usePropertyTestService } from "@/features/portfolio/testing/services/property.service"
import { useBuildingUseTestService } from "@/features/portfolio/testing/services/building-use.service"
import { useEnergyMeterTestService } from "@/features/portfolio/testing/services/energy-meter.service"
import * as React from "react"
import type { AuthService } from "@/features/auth/services/auth.service"
import { useAuthService } from "@/features/auth/infrastructure/auth.service"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import type { BuildingUseService } from "@/features/portfolio/services/building-use.service"
import type { EnergyMeterService } from "@/features/portfolio/services/energy-meter.service"
import type { PortfolioPerformanceService } from "@/features/portfolio/services/portfolio-performance.service"
import { usePortfolioPerformanceService } from "@/features/portfolio/testing/services/portfolio-performance.service"

export type Services = {
  authService: AuthService
  propertyService: PropertyService
  buildingUseService: BuildingUseService
  energyMeterService: EnergyMeterService
  portfolioPerformanceService: PortfolioPerformanceService
  // ... additional service types go here
}

// eslint-disable-next-line react-refresh/only-export-components
export const Services = React.createContext<Services>({} as Services)

export type ServicesProviderProps = {
  children: React.ReactNode
  services: Services
}

export function BaseServicesProvider({
  children,
  services,
  ...props
}: ServicesProviderProps) {
  return (
    <Services.Provider value={services} {...props}>
      {children}
    </Services.Provider>
  )
}

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
