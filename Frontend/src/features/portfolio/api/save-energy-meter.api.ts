import { use } from "react"
import { Services } from "@/context/services.context"
import { useMeterMutation } from "@/features/portfolio/api/meter-mutation.api"
import type {
  CreateEnergyMeterInput,
  UpdateEnergyMeterInput,
} from "@/features/portfolio/services/energy-meter.service"

export function useSaveEnergyMeter() {
  const { energyMeterService } = use(Services)
  return useMeterMutation(
    (input: CreateEnergyMeterInput | UpdateEnergyMeterInput) =>
      "energyMeterId" in input
        ? energyMeterService.updateEnergyMeter(input)
        : energyMeterService.createEnergyMeter(input)
  )
}
