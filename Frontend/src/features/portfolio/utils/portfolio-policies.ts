import type { Building } from "@/features/portfolio/models/building.models"
import type { User } from "@/features/portfolio/models/user.models"

export const POLICIES = {
  "building:delete": (user: User, building: Building) => {
    if (!user) {
      return false
    }

    if (building.owner?.id === user.id) {
      return true
    }

    return false
  },
}
