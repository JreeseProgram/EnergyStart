import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { paths } from "@/config/paths"
import { useAuthorization } from "@/hooks/use-authorization"
import { ROLES } from "@/models/auth.models"
import { Building, Home, Users } from "lucide-react"
import { Link } from "react-router"

export type NavMainItem = {
  title: string
  url: string
  icon?: React.ReactNode
}

export function NavMain() {
  const { checkAccess } = useAuthorization()

  const navigation = [
    {
      title: "Dashboard",
      url: paths.app.dashboard.getHref(),
      icon: <Home />,
    },
    checkAccess({ allowedRoles: [ROLES.ADMIN] }) && {
      title: "Buildings",
      url: paths.app.buildings.getHref(),
      icon: <Building />,
    },
    checkAccess({ allowedRoles: [ROLES.ADMIN] }) && {
      title: "Profile",
      url: paths.app.profile.getHref(),
      icon: <Users />,
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
