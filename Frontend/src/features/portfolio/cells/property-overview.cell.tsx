import { PropertyPerformanceCell } from "@/features/portfolio/cells/property-performance.cell"
import { PropertyBuildingUseSummaryCell } from "@/features/portfolio/cells/property-building-use-summary.cell"
import { ContentHeader } from "@/components/layouts/content-header"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Skeleton } from "@/components/ui/skeleton"
import { paths } from "@/config/paths"
import { useProperty } from "@/features/portfolio/api/get-property.api"
import {
  PropertyHeader,
  PropertyHeaderSkeleton,
} from "@/features/portfolio/components/property-header"
import { PropertyOverview } from "@/features/portfolio/components/property-overview"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { createCell } from "@/lib/react-query"

export function PropertyOverviewCell({
  propertyId,
}: {
  propertyId: PropertyId
}) {
  const query = useProperty({ propertyId })

  return createCell(query, {
    Loading: () => (
      <>
        <PropertyHeaderSkeleton />
        <ContentHeader title={<Skeleton className="h-7 w-48" />} />
      </>
    ),
    Failure: ({ ctx }) => (
      <ContentHeader
        title="Something went wrong"
        description="Unable to load property overview. Please try again."
        action={
          <Button variant="outline" onClick={() => void ctx.refetch()}>
            Retry
          </Button>
        }
      />
    ),
    Success: ({ data: property }) => {
      if (!property)
        return (
          <ContentHeader
            title="Property not found"
            action={
              <Link className="underline" to={paths.app.properties.getHref()}>
                Back to properties
              </Link>
            }
          />
        )

      return (
        <>
          <PropertyHeader property={property} />
          <ContentHeader title={"Property overview"} />
          <PropertyOverview property={property} />
          <PropertyPerformanceCell key={property.id} propertyId={property.id} />
          <PropertyBuildingUseSummaryCell propertyId={property.id} />
        </>
      )
    },
  })
}
