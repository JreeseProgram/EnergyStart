import { useState } from "react"
import { createPortfolioTestStore } from "@/features/portfolio/testing/portfolio-test-store"
import { createPropertyTestService } from "@/features/portfolio/testing/services/property.service"
import { createBuildingUseTestService } from "@/features/portfolio/testing/services/building-use.service"
import type { EnergyReportService } from "@/features/portfolio/services/energy-report.service"
import { useEnergyReportTestService } from "@/features/portfolio/testing/services/energy-report.service"
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
  energyReportService: EnergyReportService
  portfolioPerformanceService: PortfolioPerformanceService
  // ... additional service types go here
}

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
  const [store] = useState(createPortfolioTestStore)
  const propertyService = createPropertyTestService(store)
  const buildingUseService = createBuildingUseTestService(store)
  const energyMeterService = useEnergyMeterTestService(propertyService)
  const portfolioPerformanceService = usePortfolioPerformanceService()
  const energyReportService = useEnergyReportTestService(
    propertyService,
    portfolioPerformanceService
  )

  return (
    <BaseServicesProvider
      services={{
        authService,
        propertyService,
        buildingUseService,
        energyMeterService,
        portfolioPerformanceService,
        energyReportService,
        // ... additional services go here
      }}
      {...props}
    />
  )
}
