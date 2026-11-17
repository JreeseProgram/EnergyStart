import type { Property } from "@/features/portfolio/models/property.models"
import type { User } from "@/features/portfolio/models/user.models"

const canAccessProperty = (
  user: User | null | undefined,
  property: Property
) => user != null && property.authUsers.includes(user.id)

export const PORTFOLIO_POLICIES = {
  "property:view": canAccessProperty,
  "property:edit": canAccessProperty,
  "property:manage-sharing": canAccessProperty,
  "property:delete": canAccessProperty,
}
