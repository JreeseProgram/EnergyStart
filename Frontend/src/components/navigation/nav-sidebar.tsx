import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { paths } from "@/config/paths"
import {
  Building2,
  Zap,
  Home,
  FileBarChart2,
  Share2,
  Settings,
} from "lucide-react"
import { NavLink } from "react-router"

export type NavMainItem = {
  title: string
  url: string
  icon?: React.ReactNode
}

export function NavSidebar({ propertyId }: { propertyId: string }) {
  const { isMobile, setOpenMobile } = useSidebar()

  const navigation = [
    {
      title: "Overview",
      url: paths.app.property.root.getHref(propertyId),
      icon: <Home />,
    },
    {
      title: "Building Uses",
      url: paths.app.property.buildingUses.getHref(propertyId),
      icon: <Building2 />,
    },
    {
      title: "Energy Meters",
      url: paths.app.property.energyMeters.getHref(propertyId),
      icon: <Zap />,
    },
    {
      title: "Reports",
      url: paths.app.property.reports.getHref(propertyId),
      icon: <FileBarChart2 />,
    },
    {
      title: "Sharing",
      url: paths.app.property.sharing.getHref(propertyId),
      icon: <Share2 />,
    },
    {
      title: "Settings",
      url: paths.app.property.settings.getHref(propertyId),
      icon: <Settings />,
    },
  ].filter(Boolean) as NavMainItem[]
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className="aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-accent-foreground"
                render={
                  <NavLink
                    to={item.url}
                    onClick={() => {
                      if (isMobile) setOpenMobile(false)
                    }}
                    end={
                      item.url === paths.app.property.root.getHref(propertyId)
                    }
                  />
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
