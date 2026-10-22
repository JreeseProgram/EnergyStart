import type { Property } from "@/features/portfolio/models/property.models"
import type { User } from "@/features/portfolio/models/user.models"

const ownsProperty = (user: User | null | undefined, property: Property) =>
  user != null && property.owner.id === user.id

export const PORTFOLIO_POLICIES = {
  "property:view": ownsProperty,
  "property:edit": ownsProperty,
  "property:delete": ownsProperty,
  "building:view": ownsProperty,
  "building:edit": ownsProperty,
  "building:delete": ownsProperty,
}
