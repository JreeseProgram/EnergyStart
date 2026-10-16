import { use } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import { getPropertiesQueryOptions } from "@/features/portfolio/api/get-properties.api"
import type { PropertySummary } from "@/features/portfolio/models/property-summary.models"

export function usePropertySummaries() {
  const { propertyService, buildingService } = use(Services)
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ["Properties", "Summaries"],
    queryFn: async (): Promise<PropertySummary[]> => {
      const properties = await queryClient.fetchQuery(
        getPropertiesQueryOptions({ propertyService })
      )
      return Promise.all(
        properties.map(async (property) => {
          const buildings = await buildingService.getBuildings({
            propertyId: property.id,
          })
          return {
            ...property,
            buildingCount: buildings.length,
            totalFloorArea: buildings.reduce(
              (total, building) => total + building.grossFloorArea,
              0
            ),
          }
        })
      )
    },
  })
}
