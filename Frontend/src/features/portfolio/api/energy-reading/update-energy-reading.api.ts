import { use } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import { portfolioKeys } from "@/features/portfolio/api/query-keys"
import type { UpdateEnergyReadingInput } from "@/features/portfolio/services/energy-meter.service"

export function useUpdateEnergyReading() {
  const { energyMeterService } = use(Services)
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateEnergyReadingInput) =>
      energyMeterService.updateEnergyReading(input),
    onSuccess: async (_, { propertyId }) => {
      await Promise.all([
        client.invalidateQueries({
          queryKey: portfolioKeys.meters.list(propertyId),
        }),
        client.invalidateQueries({ queryKey: portfolioKeys.properties.all }),
      ])
    },
  })
}
