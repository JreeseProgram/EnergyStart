import * as React from "react"
import { useUser } from "@/features/auth/hooks/use-user"

export const useAuthorization = () => {
  const user = useUser()

  if (!user.data) {
    throw Error("User does not exist!")
  }

  const checkAccess = React.useCallback(() => {
    return true
  }, [])

  return { checkAccess }
}
