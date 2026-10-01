import { SidebarLayout } from "@/components/layouts/sidebar-layout"
import { PropertySidebar } from "@/features/portfolio/components/property-sidebar"

const PropertyRoute = () => {
  return (
    <SidebarLayout sidebar={<PropertySidebar />}>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
    </SidebarLayout>
  )
}

export default PropertyRoute
