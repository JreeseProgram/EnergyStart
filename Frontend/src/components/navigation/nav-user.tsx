import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { paths } from "@/config/paths"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useUser } from "@/features/auth/hooks/use-user"
import { Link } from "react-router"

import { CircleUserRoundIcon, LogOutIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NavUser() {
  const user = useUser()
  const logout = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="lg"
            variant={"ghost"}
            className="aria-expanded:bg-muted"
          />
        }
      >
        <Avatar className="mr-1 size-8 grayscale">
          <AvatarFallback>{user.data?.firstName.split("")[0]}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.data?.firstName}</span>
        </div>
        <ChevronDown className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="end" sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="size-8">
                <AvatarFallback>
                  {user.data?.firstName.split("")[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.data?.firstName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.data?.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link to={paths.app.profile.getHref()} />}>
            <CircleUserRoundIcon />
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout.mutate()}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
