import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { paths } from "@/config/paths"
import { useProperty } from "@/features/portfolio/api/get-property.api"
import { PropertySettings } from "@/features/portfolio/components/property-settings"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { createCell } from "@/lib/react-query"
import { Link } from "react-router"

export function PropertySettingsCell({
  propertyId,
}: {
  propertyId: PropertyId
}) {
  const query = useProperty({ propertyId })

  return createCell(query, {
    Loading: () => (
      <div role="status" aria-label="Loading property settings">
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    ),
    Failure: ({ ctx }) => (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p>Unable to load property settings. Please try again.</p>
        <Button variant="outline" onClick={() => void ctx.refetch()}>
          Retry
        </Button>
      </div>
    ),
    Success: ({ data: property }) => {
      if (!property)
        return (
          <div className="flex flex-col items-start gap-3">
            <p>Property not found.</p>
            <Link className="underline" to={paths.app.properties.getHref()}>
              Back to properties
            </Link>
          </div>
        )
      return <PropertySettings property={property} />
    },
  })
}
