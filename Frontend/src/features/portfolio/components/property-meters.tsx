import type { Property } from "@/features/portfolio/models/property.models"

export function PropertyMeters({ property }: { property: Property }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <pre>{JSON.stringify(property, null, 2)}</pre>
    </div>
  )
}
