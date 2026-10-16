import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from "@/components/ui/card"
import { Gauge } from "@/components/ui/gauge"
import { Skeleton } from "@/components/ui/skeleton"
import { paths } from "@/config/paths"
import type { Property } from "@/features/portfolio/models/property.models"
import { PROPERTY_TYPES } from "@/features/portfolio/utils/form-constants"
import { MapPinned } from "lucide-react"
import { Link } from "react-router"

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link to={paths.app.property.root.getHref(property.id)} className="group">
      <Card
        align="center"
        size="lg"
        className="transition-colors group-hover:bg-muted"
      >
        <CardHeader spacing="between">
          <CardDescription>Energy Star Score</CardDescription>
          <Gauge value={property.energyStarScore} />
        </CardHeader>
        <CardContent className="pb-2">
          <CardIcon>
            <MapPinned />
          </CardIcon>
          <CardTitle>{property.name}</CardTitle>
          <CardDescription>
            {
              PROPERTY_TYPES.find(
                (type) => type.value === property.propertyType
              )?.label
            }
            <br />
            {property.city}, {property.state}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}

export function PropertyCardSkeleton() {
  return (
    <Skeleton className="flex flex-col gap-3 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="h-2 w-1/3 rounded-full bg-foreground/5" />
        <div className="size-13 rounded-full bg-foreground/5" />
      </div>
      <div className="h-1 w-full rounded-full text-foreground/10" />
      <div className="flex flex-col items-center justify-center gap-5 pb-6">
        <div className="size-14 rounded-lg bg-foreground/5" />
        <div className="size-4 w-2/3 rounded-full bg-foreground/5" />
        <div className="flex w-full flex-col items-center justify-center gap-3 pt-1">
          <div className="h-2 w-1/4 rounded-full bg-foreground/5" />
          <div className="h-2 w-1/3 rounded-full bg-foreground/5" />
        </div>
      </div>
    </Skeleton>
  )
}
