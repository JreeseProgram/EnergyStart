import { Services } from "@/context/services.context"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { use } from "react"

export const useLogout = () => {
  const { authService } = use(Services)

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User"] })
    },
  })
}
