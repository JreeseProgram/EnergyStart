import { useProperties } from "@/features/portfolio/api/get-properties.api"
import {
  PropertiesList,
  PropertiesListEmpty,
  PropertiesListSkeleton,
} from "@/features/portfolio/components/properties-list"
import { createCell } from "@/lib/react-query"

export function PropertiesListCell() {
  const query = useProperties({})

  return createCell(query, {
    Loading: () => <PropertiesListSkeleton />,
    Failure: () => <></>,
    Success: ({ data }) => <PropertiesList properties={data} />,
    Empty: () => <PropertiesListEmpty />,
    isEmpty: ({ data }) => data.length === 0,
  })
}
