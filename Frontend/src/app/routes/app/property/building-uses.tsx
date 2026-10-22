import { ContentLayout } from "@/components/layouts/content-layout"
import { paths } from "@/config/paths"
import { PropertyBuildingsCell } from "@/features/portfolio/cells/property-buildings.cell"
import { usePropertyId } from "@/features/portfolio/hooks/use-property-id"
import { Navigate } from "react-router"

const PropertyBuildingUsesRoute = () => {
  const propertyId = usePropertyId()

  if (!propertyId) {
    return <Navigate to={paths.app.properties.getHref()} />
  }

  return (
    <ContentLayout title="Buildings">
      <PropertyBuildingsCell propertyId={propertyId} />
    </ContentLayout>
  )
}

export default PropertyBuildingUsesRoute
