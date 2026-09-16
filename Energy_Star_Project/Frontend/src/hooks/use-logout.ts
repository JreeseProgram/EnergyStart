import * as React from "react"
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query"
import { use } from "react"
import { Services } from "@/context/services.context"
import type { User } from "@/models/user.models"

export const logout = ({ authService }: Pick<Services, "authService">) => {
  return authService.logout()
}

export const useLogout = (
  options?: UseMutationOptions<unknown, Error, unknown>
) => {
  const { authService } = use(Services)

  const queryClient = useQueryClient()

  const setUser = React.useCallback(
    (data: User | null) => queryClient.setQueryData(["User"], data),
    [queryClient]
  )

  return useMutation({
    ...options,
    mutationFn: () => logout({ authService }),
    onSuccess: (...args) => {
      setUser(null)
      options?.onSuccess?.(...args)
    },
  })
}
