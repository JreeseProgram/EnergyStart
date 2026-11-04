import { use } from "react"
import { Services } from "@/context/services.context"
import { useMeterMutation } from "@/features/portfolio/api/meter-mutation.api"
import type { CreateEnergyReadingInput } from "@/features/portfolio/services/energy-meter.service"

export function useCreateEnergyReading() {
  const { energyMeterService } = use(Services)
  return useMeterMutation((input: CreateEnergyReadingInput) =>
    energyMeterService.createEnergyReading(input)
  )
}
