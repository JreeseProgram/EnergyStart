import * as React from "react"
import { Logo } from "@/components/logo"
import { NavSidebar } from "@/components/navigation/nav-sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import { PropertySwitcherCell } from "@/features/portfolio/cells/properties-switcher.cell"
import { Navigate, useParams } from "react-router"
import { paths } from "@/config/paths"

export function PropertySidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { propertyId } = useParams<{ propertyId: string }>()
  if (!propertyId) return <Navigate to={paths.app.properties.getHref()} />
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="px-2 py-2 md:hidden">
          <Logo />
        </div>
        <PropertySwitcherCell />
      </SidebarHeader>
      <SidebarContent className="overscroll-contain">
        <NavSidebar propertyId={propertyId} />
      </SidebarContent>
    </Sidebar>
  )
}

export function PropertySidebarSkeleton() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="px-2 py-2 md:hidden">
          <Logo />
        </div>
        <PropertySwitcherCell />
      </SidebarHeader>
      <SidebarContent className="overscroll-contain">
        <SidebarMenu>
          {Array.from({ length: 6 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuSkeleton />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
