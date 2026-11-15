import { useState } from "react"
import { EnergyReportApiService } from "@/features/portfolio/services/energy-report-api.service"
import type { Services } from "@/context/services.context"
import { useAuthService } from "@/features/auth/infrastructure/auth.service"
import { PropertyApiService } from "@/features/portfolio/services/property-api.service"
import { BuildingUseApiService } from "@/features/portfolio/services/building-use-api.service"
import { PortfolioPerformanceApiService } from "@/features/portfolio/services/portfolio-performance-api.service"
import { EnergyMeterApiService } from "@/features/portfolio/services/energy-meter-api.service"

export function useServices(): Services {
  const authService = useAuthService()

  const [energyReportService] = useState(() => {
    return new EnergyReportApiService()
  })

  const [propertyService] = useState(() => {
    return new PropertyApiService()
  })

  const [buildingUseService] = useState(() => {
    return new BuildingUseApiService()
  })

  const [portfolioPerformanceService] = useState(() => {
    return new PortfolioPerformanceApiService()
  })

  const [energyMeterService] = useState(() => {
    return new EnergyMeterApiService()
  })

  return {
    authService,
    propertyService,
    buildingUseService,
    portfolioPerformanceService,
    energyMeterService,
    energyReportService,
  }
}
