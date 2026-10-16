import type { Property } from "@/features/portfolio/models/property.models"

export type PropertySummary = Property & {
  buildingCount: number
  totalFloorArea: number
}
