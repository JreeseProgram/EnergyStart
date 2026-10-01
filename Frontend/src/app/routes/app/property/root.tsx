import { SidebarLayout } from "@/components/layouts/sidebar-layout"
import { AppSidebar } from "@/components/sidebars/app-sidebar"

const PropertyRoute = () => {
  return (
    <SidebarLayout sidebar={<AppSidebar />}>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
    </SidebarLayout>
  )
}

export default PropertyRoute
