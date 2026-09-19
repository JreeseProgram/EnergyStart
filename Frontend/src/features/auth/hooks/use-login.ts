import * as React from "react"
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import type {
  AuthenticatedUser,
  User,
} from "@/features/auth/models/user.models"
import type { LoginInput } from "@/features/auth/services/auth.service"

type LoginParams = { input: LoginInput }

export const login = ({
  authService,
  input,
}: Pick<Services, "authService"> & LoginParams) => {
  return authService.login(input)
}

export const useLogin = (
  options?: UseMutationOptions<AuthenticatedUser, Error, LoginInput>
) => {
  const { authService } = React.use(Services)

  const queryClient = useQueryClient()

  const setUser = React.useCallback(
    (data: User | null) => queryClient.setQueryData(["User"], data),
    [queryClient]
  )

  return useMutation({
    ...options,
    mutationFn: (input) => login({ authService, input }),
    onSuccess: (data, ...args) => {
      setUser(data.user)
      options?.onSuccess?.(data, ...args)
    },
  })
}
