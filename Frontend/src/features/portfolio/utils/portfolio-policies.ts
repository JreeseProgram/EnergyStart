import type { Property } from "@/features/portfolio/models/property.models"
import type { User } from "@/features/portfolio/models/user.models"

const ownsProperty = (user: User | null | undefined, property: Property) =>
  user != null && property.owner.id === user.id

const canAccessProperty = (user: User | null | undefined, property: Property) =>
  ownsProperty(user, property) ||
  (user != null &&
    property.assignments.some(({ user: assignee }) => assignee.id === user.id))

export const PORTFOLIO_POLICIES = {
  "property:view": canAccessProperty,
  "property:edit": canAccessProperty,
  "property:manage-sharing": ownsProperty,
  "property:delete": ownsProperty,
}
