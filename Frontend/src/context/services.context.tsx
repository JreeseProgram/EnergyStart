import * as React from "react"
import type { AuthService } from "@/features/auth/services/auth.service"
import { useAuthService } from "@/features/auth/infrastructure/auth.service"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import type { BuildingService } from "@/features/portfolio/services/building.service"
import type { EnergyMeterService } from "@/features/portfolio/services/energy-meter.service"
import { usePropertyService } from "@/features/portfolio/testing/services/property.service"
import { useBuildingService } from "@/features/portfolio/testing/services/building.service"
import { useEnergyMeterService } from "@/features/portfolio/testing/services/energy-meter.service"

export type Services = {
  authService: AuthService
  propertyService: PropertyService
  buildingService: BuildingService
  energyMeterService: EnergyMeterService
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
  const propertyService = usePropertyService()
  const buildingService = useBuildingService()
  const energyMeterService = useEnergyMeterService()

  return (
    <BaseServicesProvider
      services={{
        authService,
        propertyService,
        buildingService,
        energyMeterService,
        // ... additional services go here
      }}
      {...props}
    />
  )
}
