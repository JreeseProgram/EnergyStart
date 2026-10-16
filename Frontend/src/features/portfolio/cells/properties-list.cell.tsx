import { usePropertySummaries } from "@/features/portfolio/api/get-property-summaries.api"
import {
  PropertiesList,
  PropertiesListEmpty,
  PropertiesListSkeleton,
} from "@/features/portfolio/components/properties-list"
import { createCell } from "@/lib/react-query"

export function PropertiesListCell() {
  const query = usePropertySummaries()

  return createCell(query, {
    Loading: () => <PropertiesListSkeleton />,
    Failure: () => <></>,
    Success: ({ data }) => <PropertiesList properties={data} />,
    Empty: () => <PropertiesListEmpty />,
    isEmpty: ({ data }) => data.length === 0,
  })
}
