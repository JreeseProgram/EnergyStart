import { ContentLayout } from "@/components/layouts/content-layout"
import { paths } from "@/config/paths"
import { PropertyBuildingUsesCell } from "@/features/portfolio/cells/property-building-uses.cell"
import { usePropertyId } from "@/features/portfolio/hooks/use-property-id"
import { Navigate } from "react-router"

const PropertyBuildingUsesRoute = () => {
  const propertyId = usePropertyId()

  if (!propertyId) {
    return <Navigate to={paths.app.properties.getHref()} />
  }

  return (
    <ContentLayout seo={{ title: "Building Uses" }}>
      <PropertyBuildingUsesCell propertyId={propertyId} />
    </ContentLayout>
  )
}

export default PropertyBuildingUsesRoute
