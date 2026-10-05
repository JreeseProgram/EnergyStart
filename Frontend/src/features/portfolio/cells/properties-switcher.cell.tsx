import { useProperties } from "@/features/portfolio/api/get-properties.api"
import {
  PropertySwitcher,
  PropertySwitcherSkeleton,
} from "@/features/portfolio/components/property-switcher"
import { createCell } from "@/lib/react-query"
import { useParams } from "react-router"

export function PropertySwitcherCell() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const query = useProperties({})

  return createCell(query, {
    Success: ({ data }) => {
      const defaultProperty =
        data.find((property) => property.id === propertyId) ?? data[0]

      if (!defaultProperty) return null

      return (
        <PropertySwitcher properties={data} defaultProperty={defaultProperty} />
      )
    },
    Failure: () => <></>,
    Loading: () => <PropertySwitcherSkeleton />,
  })
}
