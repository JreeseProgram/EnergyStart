import { use } from "react"
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import type {
  EnergyMeterService,
  GetEnergyMeterInput,
  CreateEnergyMeterInput,
  UpdateEnergyMeterInput,
  CreateEnergyReadingInput,
} from "@/features/portfolio/services/energy-meter.service"

export function getEnergyMetersQueryOptions(
  propertyId: PropertyId,
  service: EnergyMeterService
) {
  return queryOptions({
    queryKey: ["EnergyMeters", propertyId],
    queryFn: () => service.getEnergyMeters({ propertyId }),
  })
}
export function useEnergyMeters(propertyId: PropertyId) {
  const { energyMeterService } = use(Services)
  return useQuery(getEnergyMetersQueryOptions(propertyId, energyMeterService))
}
export function useEnergyMeter(input: GetEnergyMeterInput) {
  const { energyMeterService } = use(Services)
  return useQuery({
    queryKey: ["EnergyMeters", input.propertyId, input.energyMeterId],
    queryFn: () => energyMeterService.getEnergyMeter(input),
  })
}
function useMeterMutation<T extends { propertyId: PropertyId }>(
  mutationFn: (input: T) => Promise<EnergyMeter>
) {
  const client = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: async (_, input) => {
      await client.invalidateQueries({
        queryKey: ["EnergyMeters", input.propertyId],
      })
    },
  })
}
export function useSaveEnergyMeter() {
  const { energyMeterService } = use(Services)
  return useMeterMutation(
    (input: CreateEnergyMeterInput | UpdateEnergyMeterInput) =>
      "energyMeterId" in input
        ? energyMeterService.updateEnergyMeter(input)
        : energyMeterService.createEnergyMeter(input)
  )
}
export function useCreateEnergyReading() {
  const { energyMeterService } = use(Services)
  return useMeterMutation((input: CreateEnergyReadingInput) =>
    energyMeterService.createEnergyReading(input)
  )
}
