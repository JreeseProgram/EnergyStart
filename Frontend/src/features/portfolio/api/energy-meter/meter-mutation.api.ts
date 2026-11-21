import { portfolioKeys } from "@/features/portfolio/api/query-keys"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"

export function useMeterMutation<T extends { propertyId: PropertyId }>(
  mutationFn: (input: T) => Promise<EnergyMeter>
) {
  const client = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: async (_, input) => {
      await client.invalidateQueries({
        queryKey: portfolioKeys.meters.list(input.propertyId),
      })
    },
  })
}
