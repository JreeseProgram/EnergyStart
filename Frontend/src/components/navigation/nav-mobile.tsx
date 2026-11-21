import { paths } from "@/config/paths"
import { LayoutGrid, MapPinned } from "lucide-react"
import { NavLink } from "react-router"

const items = [
  {
    title: "Dashboard",
    to: paths.app.dashboard.getHref(),
    icon: LayoutGrid,
    end: true,
  },
  {
    title: "Properties",
    to: paths.app.properties.getHref(),
    icon: MapPinned,
    end: false,
  },
]

export function NavMobile() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-card md:hidden"
    >
      <div className="grid grid-cols-2">
        {items.map(({ title, to, icon: Icon, end }) => (
          <NavLink
            key={title}
            to={to}
            end={end}
            className="flex min-h-[calc(3.5rem+env(safe-area-inset-bottom))] min-w-0 flex-col items-center justify-center gap-1 pb-[env(safe-area-inset-bottom)] text-xs font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset aria-[current=page]:bg-navigation-active aria-[current=page]:text-navigation-active-foreground"
          >
            <Icon aria-hidden="true" className="size-4" />
            <span>{title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
