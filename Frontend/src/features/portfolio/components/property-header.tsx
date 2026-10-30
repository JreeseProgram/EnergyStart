import { Skeleton } from "@/components/ui/skeleton"
import type { Property } from "@/features/portfolio/models/property.models"
import { MapPinned } from "lucide-react"

export function PropertyHeader({ property }: { property: Property }) {
  return (
    <div className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground">
      <div className="flex size-14 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <MapPinned />
      </div>
      <div>
        <h2 className="text-2xl font-bold">{property.name}</h2>
        <p className="text-sm text-muted-foreground">
          {property.streetAddress}, {property.city}, {property.state}
        </p>
      </div>
    </div>
  )
}

export function PropertyHeaderSkeleton() {
  return (
    <Skeleton className="flex w-full items-center gap-4 rounded-xl p-4">
      <div className="aspect-square size-14 rounded-xl bg-foreground/5" />
      <div className="flex w-full flex-col justify-center gap-2">
        <div className="min-h-6 w-full max-w-48 rounded-full bg-foreground/5" />
        <div className="min-h-3 w-full max-w-36 rounded-full bg-foreground/5" />
      </div>
    </Skeleton>
  )
}
