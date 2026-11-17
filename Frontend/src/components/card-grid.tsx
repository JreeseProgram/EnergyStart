import * as React from "react"
import { cn } from "cn"

const cardGradients = [
  "var(--color-emerald-500)",
  "var(--color-lime-500)",
  "var(--color-blue-500)",
  "var(--color-amber-500)",
] as const

export function CardGrid({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-grid"
      className={cn(
        "grid grid-cols-4 gap-4 **:data-[slot=card]:bg-[linear-gradient(130deg,color-mix(in_oklab,var(--card-gradient)_8%,transparent)_0%,var(--color-card)_100%)]",
        "**:data-[slot=badge]:bg-[color-mix(in_oklab,var(--card-gradient)_15%,transparent)]",
        "**:data-[slot=badge]:text-[color-mix(in_oklab,var(--card-gradient)_60%,var(--color-foreground))]",
        "**:data-[slot=badge]:border-[color-mix(in_oklab,var(--card-gradient)_30%,transparent)]",
        className
      )}
      {...props}
    >
      {React.Children.toArray(children).map((child, index) => {
        if (!React.isValidElement<{ style?: React.CSSProperties }>(child)) {
          return child
        }

        return React.cloneElement(child, {
          style: {
            ...child.props.style,
            "--card-gradient": cardGradients[index % cardGradients.length],
          } as React.CSSProperties,
        })
      })}
    </div>
  )
}
