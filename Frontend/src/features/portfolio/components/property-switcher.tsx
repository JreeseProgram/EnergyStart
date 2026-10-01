"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  GalleryVerticalEndIcon,
  ChevronsUpDownIcon,
  CheckIcon,
} from "lucide-react"
import type { Property } from "@/features/portfolio/models/property.models"

export function PropertySwitcher({
  properties,
  defaultProperty,
}: {
  properties: Property[]
  defaultProperty: Property
}) {
  const [selectedProperty, setselectedProperty] =
    React.useState<Property>(defaultProperty)
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">Property</span>
              <span className="">{selectedProperty.name}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {properties.map((property) => (
              <DropdownMenuItem
                key={`property_switcher_item_${property.id}`}
                onSelect={() => setselectedProperty(property)}
              >
                {property.name}{" "}
                {property === selectedProperty && (
                  <CheckIcon className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
