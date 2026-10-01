import { Logo } from "@/components/logo"
import { NavMain } from "@/components/navigation/nav-main"
import { NavUser } from "@/components/navigation/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"

export function AppTopBar() {
  return (
    <div className="flex items-center gap-4">
      <Logo />
      <NavMain />
      <Separator className={"ml-auto opacity-0"} orientation="vertical" />
      <ThemeToggle />
      <NavUser />
    </div>
  )
}
