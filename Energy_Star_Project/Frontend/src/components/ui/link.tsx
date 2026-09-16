import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router"

import { cn } from "@/lib/shadcn"

export function Link({ className, ...props }: RouterLinkProps) {
  return (
    <RouterLink
      className={cn(
        "font-medium text-primary underline-offset-4 hover:underline",
        className
      )}
      {...props}
    />
  )
}
