import * as React from "react"
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
        <PropertySwitcherCell />
      </SidebarHeader>
      <SidebarContent>
        <NavSidebar propertyId={propertyId} />
      </SidebarContent>
    </Sidebar>
  )
}

export function PropertySidebarSkeleton() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <PropertySwitcherCell />
      </SidebarHeader>
      <SidebarContent>
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
