import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useBuildingUses } from "@/features/portfolio/api/get-building-uses.api"
import { PropertyBuildingUseSummary } from "@/features/portfolio/components/property-building-use-summary"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { createCell } from "@/lib/react-query"

export function PropertyBuildingUseSummaryCell({
  propertyId,
}: {
  propertyId: PropertyId
}) {
  const query = useBuildingUses({ input: { propertyId } })
  return createCell(query, {
    Loading: () => (
      <div role="status" aria-label="Loading building-use summary">
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    ),
    Failure: ({ ctx }) => (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 rounded-xl border border-border p-6"
      >
        <p>Unable to load building uses. Please try again.</p>
        <Button variant="outline" onClick={() => void ctx.refetch()}>
          Retry
        </Button>
      </div>
    ),
    Success: ({ data }) => (
      <PropertyBuildingUseSummary propertyId={propertyId} buildingUses={data} />
    ),
  })
}
