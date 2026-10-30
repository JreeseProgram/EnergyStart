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
import { EnergyMetersListCell } from "@/features/portfolio/cells/energy-meters-list.cell"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { createCell } from "@/lib/react-query"

export function PropertyMetersCell({ propertyId }: { propertyId: PropertyId }) {
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
        description="Unable to load this property. Please try again."
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
          <EnergyMetersListCell key={property.id} property={property} />
        </>
      )
    },
  })
}
