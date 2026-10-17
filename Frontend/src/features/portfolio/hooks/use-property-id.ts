import { useParams } from "react-router"

import { PropertyId } from "@/features/portfolio/models/property.models"

export const usePropertyId = (): PropertyId | undefined => {
  const { propertyId } = useParams<{ propertyId: string }>()
  const result = PropertyId.safeParse(propertyId)

  return result.success ? result.data : undefined
}
