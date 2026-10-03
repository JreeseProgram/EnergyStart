import { useProperties } from "@/features/portfolio/api/get-properties"
import {
  PropertySwitcher,
  PropertySwitcherSkeleton,
} from "@/features/portfolio/components/property-switcher"
import { createCell } from "@/lib/react-query"

export function PropertySwitcherCell() {
  const query = useProperties({})
  return createCell(query, {
    Success: ({ data }) => (
      <PropertySwitcher properties={data} defaultProperty={data[0]} />
    ),
    Failure: () => <></>,
    Loading: () => <PropertySwitcherSkeleton />,
  })
}
