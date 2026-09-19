import type { Building } from "@/features/portfolio/models/building.models"
import type { User } from "@/features/auth/models/user.models"

export const POLICIES = {
  "building:delete": (user: User, building: Building) => {
    if (user.role === "ADMIN") {
      return true
    }

    if (user.role === "USER" && building.owner?.id === user.id) {
      return true
    }

    return false
  },
}
