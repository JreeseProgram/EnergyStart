import { cn } from "cn"

const defaultColors = {
  20: "var(--color-red-400)",
  40: "var(--color-orange-400)",
  50: "var(--color-blue-400)",
  75: "var(--color-emerald-400)",
  100: "var(--color-purple-400)",
}

type GaugeProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number
  /** Maps inclusive upper bounds to colors; the highest bound is the fallback. */
  colors?: Readonly<Record<number, string>>
}

export function Gauge({
  value,
  colors = defaultColors,
  className,
  ...props
}: GaugeProps) {
  const isPerfect = value === 100
  const stops = Object.entries(colors)
    .map(([stop, color]) => ({ stop: Number(stop), color }))
    .sort((a, b) => a.stop - b.stop)

  const accentColor =
    stops.find(({ stop }) => value <= stop)?.color ??
    stops[stops.length - 1]?.color ??
    defaultColors[100]

  return (
    <div
      className={cn(
        "relative isolate flex aspect-square size-13.5 items-center justify-center overflow-clip rounded-full border bg-background",
        isPerfect &&
          "border-amber-300 shadow-[0_0_16px_var(--color-amber-400)]",
        className
      )}
      title={isPerfect ? "Perfect score!" : undefined}
      {...props}
    >
      <div
        className="absolute inset-0 z-0 transition-colors"
        style={{
          background: isPerfect
            ? "conic-gradient(from 45deg, var(--color-amber-300), var(--color-yellow-100), var(--color-amber-500), var(--color-yellow-100), var(--color-amber-300))"
            : `conic-gradient(from 0deg, ${accentColor} 0% ${value}%,var(--color-border) ${value}% 100%)`,
        }}
      />
      <div
        className={cn(
          "relative z-10 grid size-11 place-items-center rounded-full bg-card text-lg font-bold"
        )}
      >
        {value}
      </div>
    </div>
  )
}
