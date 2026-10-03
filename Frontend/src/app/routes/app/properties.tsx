import { ContentLayout } from "@/components/layouts/content-layout"
import { PropertiesListCell } from "@/features/portfolio/cells/properties-list.cell"

const PropertiesRoute = () => {
  return (
    <ContentLayout title="Properties">
      <PropertiesListCell />
    </ContentLayout>
  )
}

export default PropertiesRoute
