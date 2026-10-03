import * as React from "react"
import type { AuthService } from "@/features/auth/services/auth.service"
import { useAuthService } from "@/features/auth/infrastructure/auth.service"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import { usePropertyService } from "@/features/portfolio/testing/property.service"

export type Services = {
  authService: AuthService
  propertyService: PropertyService
  // ... additional service types go here
}

// eslint-disable-next-line react-refresh/only-export-components
export const Services = React.createContext<Services>({} as Services)

type ServicesProviderProps = {
  children: React.ReactNode
  services: Services
}

function BaseServicesProvider({
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

  return (
    <BaseServicesProvider
      services={{
        authService,
        propertyService,
        // ... additional services go here
      }}
      {...props}
    />
  )
}
