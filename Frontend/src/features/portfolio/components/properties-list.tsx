import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Grid } from "@/components/ui/grid"
import {
  PropertyCard,
  PropertyCardSkeleton,
} from "@/features/portfolio/components/property-card"
import type { Property } from "@/features/portfolio/models/property.models"
import { MapPinned } from "lucide-react"
import type { PropsWithChildren } from "react"

export function PropertiesList({ properties }: { properties: Property[] }) {
  return (
    <Grid>
      {properties.map((property) => (
        <PropertyCard
          key={`property_card_${property.id}`}
          property={property}
        />
      ))}
    </Grid>
  )
}

export function PropertiesListSkeleton() {
  return (
    <div className="relative isolate max-h-[calc(100vh-var(--header-height)-8rem)] overflow-hidden">
      <Grid>
        {Array.from({ length: 12 }, (_, index) => (
          <PropertyCardSkeleton key={`property_card_skeleton_${index}`} />
        ))}
      </Grid>
      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-background via-background/80 via-10%" />
    </div>
  )
}

export function PropertiesListEmpty({ children }: PropsWithChildren) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MapPinned />
        </EmptyMedia>
        <EmptyTitle>No Properties Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any properties yet. Get started by creating
          your first property.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        {children}
      </EmptyContent>
    </Empty>
  )
}
