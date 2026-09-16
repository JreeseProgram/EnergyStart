import * as React from "react"
import { useUser } from "@/hooks/use-user"
import type { Roles } from "@/models/auth.models"

export const useAuthorization = () => {
  const user = useUser()

  if (!user.data) {
    throw Error("User does not exist!")
  }

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: Roles[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user.data) {
        return allowedRoles?.includes(user.data.role)
      }

      return true
    },
    [user.data]
  )

  return { checkAccess, role: user.data.role }
}
