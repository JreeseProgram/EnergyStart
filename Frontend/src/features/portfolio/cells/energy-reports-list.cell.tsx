import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEnergyReports } from "@/features/portfolio/api/get-energy-reports.api"
import { PropertyReports } from "@/features/portfolio/components/property-reports"
import type { Property } from "@/features/portfolio/models/property.models"
import { createCell } from "@/lib/react-query"

export function EnergyReportsListCell({ property }: { property: Property }) {
  const query = useEnergyReports(property.id)
  return createCell(query, {
    Loading: () => (
      <div
        role="status"
        aria-label="Loading property reports"
        className="flex flex-col gap-6"
      >
        <div className="flex justify-between">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-9 w-40" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    ),
    Failure: ({ ctx }) => (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p>Unable to load reports. Please try again.</p>
        <Button variant="outline" onClick={() => void ctx.refetch()}>
          Retry
        </Button>
      </div>
    ),
    Success: ({ data }) => (
      <PropertyReports property={property} reports={data} />
    ),
  })
}
