import type { Building } from "@/models/building.models"
import type { User } from "@/models/user.models"

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
