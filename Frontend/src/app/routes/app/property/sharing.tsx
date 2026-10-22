import { ContentLayout } from "@/components/layouts/content-layout"
import { paths } from "@/config/paths"
import { PropertySharingCell } from "@/features/portfolio/cells/property-sharing.cell"
import { usePropertyId } from "@/features/portfolio/hooks/use-property-id"
import { Navigate } from "react-router"

const PropertySharingRoute = () => {
  const propertyId = usePropertyId()

  if (!propertyId) {
    return <Navigate to={paths.app.properties.getHref()} />
  }

  return (
    <ContentLayout seo={{ title: "Property Sharing" }}>
      <PropertySharingCell propertyId={propertyId} />
    </ContentLayout>
  )
}

export default PropertySharingRoute
