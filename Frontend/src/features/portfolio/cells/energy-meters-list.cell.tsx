import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEnergyMeters } from "@/features/portfolio/api/energy-meters.api"
import { PropertyMeters } from "@/features/portfolio/components/property-meters"
import type { Property } from "@/features/portfolio/models/property.models"
import { createCell } from "@/lib/react-query"

export function EnergyMetersListCell({ property }: { property: Property }) {
  const query = useEnergyMeters(property.id)
  return createCell(query, {
    Loading: () => (
      <div
        role="status"
        aria-label="Loading energy meters"
        className="flex flex-col gap-6"
      >
        <div className="flex justify-between">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    ),
    Failure: ({ ctx }) => (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p>Unable to load energy meters. Please try again.</p>
        <Button variant="outline" onClick={() => void ctx.refetch()}>
          Retry
        </Button>
      </div>
    ),
    Success: ({ data }) => (
      <PropertyMeters
        property={property}
        meters={data.filter((meter) => meter.propertyId === property.id)}
      />
    ),
  })
}
