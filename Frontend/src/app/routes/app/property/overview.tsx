import { ContentLayout } from "@/components/layouts/content-layout"
import { paths } from "@/config/paths"
import { PropertyOverviewCell } from "@/features/portfolio/cells/property-overview.cell"
import { usePropertyId } from "@/features/portfolio/hooks/use-property-id"
import { Navigate } from "react-router"

const PropertyOverviewRoute = () => {
  const propertyId = usePropertyId()

  if (!propertyId) {
    return <Navigate to={paths.app.properties.getHref()} />
  }

  return (
    <ContentLayout seo={{ title: "Property Overview" }}>
      <PropertyOverviewCell propertyId={propertyId} />
    </ContentLayout>
  )
}

export default PropertyOverviewRoute
