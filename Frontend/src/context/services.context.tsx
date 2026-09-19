import * as React from "react"
import type { AuthService } from "@/features/auth/services/auth.service"

export type Services = {
  authService: AuthService
}

// eslint-disable-next-line react-refresh/only-export-components
export const Services = React.createContext<Services>({} as Services)

export function ServicesProvider({
  children,
  services,
  ...props
}: {
  children: React.ReactNode
  services: Services
}) {
  return (
    <Services.Provider value={services} {...props}>
      {children}
    </Services.Provider>
  )
}
