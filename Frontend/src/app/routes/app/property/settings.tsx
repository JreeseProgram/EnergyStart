import { ContentLayout } from "@/components/layouts/content-layout"
import { paths } from "@/config/paths"
import { PropertySettingsCell } from "@/features/portfolio/cells/property-settings.cell"
import { usePropertyId } from "@/features/portfolio/hooks/use-property-id"
import { Navigate } from "react-router"

const PropertySettingsRoute = () => {
  const propertyId = usePropertyId()

  if (!propertyId) return <Navigate to={paths.app.properties.getHref()} />

  return (
    <ContentLayout title="Property Settings">
      <PropertySettingsCell propertyId={propertyId} />
    </ContentLayout>
  )
}

export default PropertySettingsRoute
