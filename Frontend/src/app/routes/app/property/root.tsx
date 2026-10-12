import { SidebarLayout } from "@/components/layouts/sidebar-layout"
import { PropertySidebar } from "@/features/portfolio/components/property-sidebar"
import { Outlet } from "react-router"

const PropertyRoute = () => {
  return (
    <SidebarLayout sidebar={<PropertySidebar />}>
      <Outlet />
    </SidebarLayout>
  )
}

export default PropertyRoute
