import {
  BaseServicesProvider,
  type ServicesProviderProps,
} from "@/context/services.context"
import { useTestServices } from "@/testing/hooks/use-test-services"

export function ServicesProvider(
  props: Omit<ServicesProviderProps, "services">
) {
  const services = useTestServices()
  return <BaseServicesProvider services={services} {...props} />
}
