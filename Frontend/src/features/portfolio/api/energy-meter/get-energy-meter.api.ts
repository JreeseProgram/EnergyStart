import { portfolioKeys } from "@/features/portfolio/api/query-keys"
import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import type { GetEnergyMeterInput } from "@/features/portfolio/services/energy-meter.service"

export function useEnergyMeter(input: GetEnergyMeterInput) {
  const { energyMeterService } = use(Services)
  return useQuery({
    queryKey: portfolioKeys.meters.detail(
      input.propertyId,
      input.energyMeterId
    ),
    queryFn: () => energyMeterService.getEnergyMeter(input),
  })
}
