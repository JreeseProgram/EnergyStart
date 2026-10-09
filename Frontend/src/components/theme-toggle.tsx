import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@base-ui/react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle(props: ButtonProps) {
  const { theme, setTheme } = useTheme()
  const Icon = theme === "dark" ? Sun : Moon
  return (
    <Button
      variant={"ghost"}
      size={"icon-sm"}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      {...props}
    >
      <Icon />
    </Button>
  )
}
