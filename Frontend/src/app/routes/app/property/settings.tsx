import { ContentLayout } from "@/components/layouts/content-layout"
import { PropertySettingsCell } from "@/features/portfolio/cells/property-settings.cell"
import { useParams } from "react-router"

const PropertySettingsRoute = () => {
  const { propertyId } = useParams<{ propertyId: string }>()
  return (
    <ContentLayout title="Settings">
      {propertyId && <PropertySettingsCell propertyId={propertyId} />}
    </ContentLayout>
  )
}

export default PropertySettingsRoute
