import type { Property } from "@/features/portfolio/models/property.models"
import type { User } from "@/features/portfolio/models/user.models"
import type { AuthenticatedUser } from "@/features/auth/models/auth.models"

const ownsProperty = (
  user: User | AuthenticatedUser | null | undefined,
  property: Property
) =>
  user != null && property.owner.id === user.id

export const PROPERTY_POLICIES = {
  "property:view": ownsProperty,
  "property:edit": ownsProperty,
  "property:delete": ownsProperty,
  "building:view": ownsProperty,
  "building:edit": ownsProperty,
  "building:delete": ownsProperty,
}
