import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const Icon = theme === "dark" ? Sun : Moon
  return (
    <Button
      variant={"ghost"}
      size={"icon-sm"}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Icon />
    </Button>
  )
}
