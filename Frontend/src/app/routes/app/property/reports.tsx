import { ContentLayout } from "@/components/layouts/content-layout"
import { paths } from "@/config/paths"
import { PropertyReportsCell } from "@/features/portfolio/cells/property-reports.cell"
import { usePropertyId } from "@/features/portfolio/hooks/use-property-id"
import { Navigate } from "react-router"

const PropertyReportsRoute = () => {
  const propertyId = usePropertyId()

  if (!propertyId) return <Navigate to={paths.app.properties.getHref()} />

  return (
    <ContentLayout title="Property Reports">
      <PropertyReportsCell propertyId={propertyId} />
    </ContentLayout>
  )
}

export default PropertyReportsRoute
