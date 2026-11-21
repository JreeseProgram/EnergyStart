import { portfolioKeys } from "@/features/portfolio/api/query-keys"
import { use } from "react"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import type { EnergyMeterService } from "@/features/portfolio/services/energy-meter.service"

export function getEnergyMetersQueryOptions(
  propertyId: PropertyId,
  service: EnergyMeterService
) {
  return queryOptions({
    queryKey: portfolioKeys.meters.list(propertyId),
    queryFn: () => service.getEnergyMeters({ propertyId }),
  })
}
export function useEnergyMeters(propertyId: PropertyId) {
  const { energyMeterService } = use(Services)
  return useQuery(getEnergyMetersQueryOptions(propertyId, energyMeterService))
}
