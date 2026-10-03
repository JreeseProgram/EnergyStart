import * as React from "react"
import { NavSidebar } from "@/components/navigation/nav-sidebar"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { PropertySwitcherCell } from "@/features/portfolio/cells/properties-switcher.cell"

export function PropertySidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <PropertySwitcherCell />
      </SidebarHeader>
      <SidebarContent>
        <NavSidebar propertyId="test" />
      </SidebarContent>
    </Sidebar>
  )
}
