import { ContentHeader } from "@/components/layouts/content-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useBuildingUses } from "@/features/portfolio/api/get-building-uses.api"
import { BuildingUses } from "@/features/portfolio/components/building-uses"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { createCell } from "@/lib/react-query"

export function BuildingUsesCell({ propertyId }: { propertyId: PropertyId }) {
  const query = useBuildingUses({ input: { propertyId } })
  return createCell(query, {
    Loading: () => (
      <div role="status" aria-label="Loading building uses">
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    ),
    Failure: ({ ctx }) => (
      <div role="alert">
        <ContentHeader
          title="Building uses"
          description="Unable to load building uses. Please try again."
          action={
            <Button variant="outline" onClick={() => void ctx.refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    ),
    Success: ({ data }) => (
      <BuildingUses propertyId={propertyId} buildingUses={data} />
    ),
  })
}
