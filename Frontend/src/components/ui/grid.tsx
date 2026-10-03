import { cn } from "cn"
import type React from "react"

function Grid({
  children,
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid w-full gap-4 md:grid-cols-3 xl:grid-cols-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Grid }
