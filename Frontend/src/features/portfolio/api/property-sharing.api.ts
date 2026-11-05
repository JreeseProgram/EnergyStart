import { use } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Services } from "@/context/services.context"

export function useAddPropertyUser() {
  const { propertyService } = use(Services)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: propertyService.addPropertyUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["Properties"] }),
  })
}

export function useRemovePropertyUser() {
  const { propertyService } = use(Services)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: propertyService.removePropertyUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["Properties"] }),
  })
}
