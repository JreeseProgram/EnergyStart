import { cn } from "cn"

export function Gauge({
  value,
  className,
  ...props
}: { value: number } & React.HTMLAttributes<HTMLDivElement>) {
  const accentColor =
    value <= 25
      ? "var(--color-red-400)"
      : value <= 50
        ? "var(--color-amber-400)"
        : "var(--color-chart-2)"

  return (
    <div
      className={cn(
        "relative isolate flex aspect-square size-13.5 items-center justify-center overflow-clip rounded-full border bg-background",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 z-0 transition-colors"
        style={{
          background: `conic-gradient(from 0deg, ${accentColor} 0% ${value}%,var(--color-border) ${value}% 100%)`,
        }}
      />
      <div className="relative z-10 grid size-11 place-items-center rounded-full bg-card text-lg font-bold">
        {value}
      </div>
    </div>
  )
}
