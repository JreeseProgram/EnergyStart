import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  getPortfolioPerformance,
  PortfolioMetric,
  PortfolioMonths,
} from "@/features/portfolio/utils/get-portfolio-performance"

const metrics = {
  siteEui: "Site EUI",
  sourceEui: "Source EUI",
  energyStarScore: "Energy Star Score",
}
const ranges = [3, 6, 12].map((value) => ({
  value,
  label: `Last ${value} months`,
}))
const monthLabel = (month: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${month}T00:00:00.000Z`))

export function PortfolioPerformanceChart({
  performance,
  metric,
  months,
  onMetricChange,
  onMonthsChange,
}: {
  performance: ReturnType<typeof getPortfolioPerformance>
  metric: PortfolioMetric
  months: PortfolioMonths
  onMetricChange: (metric: PortfolioMetric) => void
  onMonthsChange: (months: PortfolioMonths) => void
}) {
  const rangeId = useId()
  const value = performance.period[metric]
  return (
    <Card className="rounded-2xl">
      <CardHeader spacing="between">
        <div>
          <CardTitle>Portfolio performance trend</CardTitle>
          <CardDescription>
            Simulated monthly performance at portfolio properties
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor={rangeId} className="sr-only">
            Performance date range
          </label>
          <Select
            items={ranges}
            value={months}
            onValueChange={(value) => {
              if (value === 3 || value === 6 || value === 12)
                onMonthsChange(value)
            }}
          >
            <SelectTrigger id={rangeId} size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ranges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={metric}
          onValueChange={(value) => {
            if (
              value === "siteEui" ||
              value === "sourceEui" ||
              value === "energyStarScore"
            )
              onMetricChange(value)
          }}
        >
          <TabsList aria-label="Performance metric">
            {Object.entries(metrics).map(([key, label]) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={metric}>
            <p
              className="my-6 text-3xl font-bold tabular-nums"
              aria-live="polite"
            >
              {value === null
                ? "No data"
                : value.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                  })}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {metric === "energyStarScore"
                  ? "area-weighted score"
                  : `kBtu/ft² over ${months} months`}
              </span>
            </p>
            {value === null ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No performance history is available for this period.
              </div>
            ) : (
              <ChartContainer
                className="h-64 w-full"
                config={{
                  [metric]: { label: metrics[metric], color: "var(--chart-1)" },
                }}
              >
                <AreaChart
                  accessibilityLayer
                  data={performance.points}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={monthLabel}
                    minTickGap={24}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(label) =>
                          typeof label === "string" ? monthLabel(label) : label
                        }
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey={metric}
                    stroke={`var(--color-${metric})`}
                    fill={`var(--color-${metric})`}
                    fillOpacity={0.3}
                    connectNulls={false}
                  />
                </AreaChart>
              </ChartContainer>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              EUI chart points are monthly; the headline covers the selected
              period. Scores are weighted by floor area.{" "}
              {performance.propertiesWithHistory} properties have complete
              history.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
