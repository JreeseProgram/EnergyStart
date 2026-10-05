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
import { ChevronsUpDownIcon, CheckIcon, MapPinned } from "lucide-react"
import type { Property } from "@/features/portfolio/models/property.models"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router"
import { paths } from "@/config/paths"

export function PropertySwitcher({
  properties,
  defaultProperty,
}: {
  properties: Property[]
  defaultProperty: Property
}) {
  const [selectedProperty, setSelectedProperty] =
    React.useState<Property>(defaultProperty)
  const navigate = useNavigate()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                variant={"outline"}
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <MapPinned className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">{selectedProperty.name}</span>
              {/* TODO: need to update to be dynamic */}
              <span className="text-xs text-muted-foreground">
                Office • Orlando, FL
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {properties.map((property) => (
              <DropdownMenuItem
                key={`property_switcher_item_${property.id}`}
                onClick={() => {
                  setSelectedProperty(property)
                  navigate(paths.app.property.root.getHref(property.id))
                }}
              >
                {property.name}{" "}
                {property.id === selectedProperty.id && (
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

export function PropertySwitcherSkeleton() {
  return (
    <Skeleton className="flex h-12 items-center gap-2 p-2">
      <div className="aspect-square size-8 rounded-lg bg-foreground/5" />
      <div className="flex w-full flex-col gap-2">
        <div className="h-2 w-2/3 rounded-full bg-foreground/5" />
        <div className="h-2 w-1/3 rounded-full bg-foreground/5" />
      </div>
      <div className="mr-1 h-4 w-3 rounded-full bg-foreground/5" />
    </Skeleton>
  )
}
