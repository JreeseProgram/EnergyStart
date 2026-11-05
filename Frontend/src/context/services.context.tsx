import type { EnergyReportService } from "@/features/portfolio/services/energy-report.service"
import * as React from "react"
import type { AuthService } from "@/features/auth/services/auth.service"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import type { BuildingUseService } from "@/features/portfolio/services/building-use.service"
import type { EnergyMeterService } from "@/features/portfolio/services/energy-meter.service"
import type { PortfolioPerformanceService } from "@/features/portfolio/services/portfolio-performance.service"
import { useServices } from "@/hooks/use-services"

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
  const services = useServices()
  return <BaseServicesProvider services={services} {...props} />
}
