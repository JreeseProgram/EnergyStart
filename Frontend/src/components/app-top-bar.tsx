import { Logo } from "@/components/logo"
import { NavMain } from "@/components/navigation/nav-main"
import { NavUser } from "@/components/navigation/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppTopBar() {
  return (
    <div className="flex items-center gap-4">
      <Logo />
      <NavMain />
      <ThemeToggle className={"ml-auto"} />
      <NavUser />
    </div>
  )
}
