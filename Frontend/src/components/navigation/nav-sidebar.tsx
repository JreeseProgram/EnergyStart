import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
import { Link } from "react-router"

export type NavMainItem = {
  title: string
  url: string
  icon?: React.ReactNode
}

export function NavSidebar({ propertyId }: { propertyId: string }) {
  const navigation = [
    {
      title: "Overview",
      url: paths.app.property.root.getHref(propertyId),
      icon: <Home />,
    },
    {
      title: "Buildings",
      url: paths.app.property.buildings.getHref(propertyId),
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
                render={<Link to={item.url} />}
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
