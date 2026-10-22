import { ContentLayout } from "@/components/layouts/content-layout"
import { paths } from "@/config/paths"
import { PropertyMetersCell } from "@/features/portfolio/cells/property-meters.cell"
import { usePropertyId } from "@/features/portfolio/hooks/use-property-id"
import { Navigate } from "react-router"

const PropertyMetersRoute = () => {
  const propertyId = usePropertyId()

  if (!propertyId) return <Navigate to={paths.app.properties.getHref()} />

  return (
    <ContentLayout title="Energy Meters">
      <PropertyMetersCell propertyId={propertyId} />
    </ContentLayout>
  )
}

export default PropertyMetersRoute
