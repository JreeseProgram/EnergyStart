import * as React from "react"
import { NavSidebar } from "@/components/navigation/nav-sidebar"

import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { PropertySwitcher } from "@/features/portfolio/components/property-switcher"
import { Property } from "@/features/portfolio/models/property.models"

const properties = [
  {
    id: crypto.randomUUID(),
    name: "Lake Eola Offices",
  },
  {
    id: crypto.randomUUID(),
    name: "Central Shopping Center",
  },
].map((property) => Property.parse(property))

export function PropertySidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <PropertySwitcher
          properties={properties}
          defaultProperty={properties[0]}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavSidebar propertyId="test" />
      </SidebarContent>
    </Sidebar>
  )
}
