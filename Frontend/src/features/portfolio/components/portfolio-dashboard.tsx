import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Property } from "@/features/portfolio/models/property.models"
import type { PortfolioPerformance } from "@/features/portfolio/models/portfolio-performance.models"
import { PortfolioPropertiesTable } from "@/features/portfolio/components/portfolio-properties-table"
import { PortfolioPerformanceChart } from "@/features/portfolio/components/portfolio-performance-chart"
import {
  getPortfolioPerformance,
  type PortfolioMetric,
  type PortfolioMonths,
} from "@/features/portfolio/utils/get-portfolio-performance"

export function PortfolioDashboard({
  properties,
  performance,
}: {
  properties: Property[]
  performance: PortfolioPerformance
}) {
  const [metric, setMetric] = useState<PortfolioMetric>("siteEui")
  const [months, setMonths] = useState<PortfolioMonths>(12)
  const summary = getPortfolioPerformance(performance, months)
  const change = summary.energyChangePercent
  const cards = [
    {
      label: "Portfolio size",
      value: String(properties.length),
      unit: properties.length === 1 ? "property" : "properties",
      title: "Portfolio size",
      detail: "Properties in your accessible portfolio",
    },
    {
      label: "Energy trend",
      value: change === null ? "No data" : `${Math.abs(change).toFixed(1)}%`,
      unit:
        change === null
          ? ""
          : change < 0
            ? "lower"
            : change > 0
              ? "higher"
              : "change",
      title: "Energy use vs. prior year",
      detail: `Same ${months}-month period, comparable properties only`,
    },
    {
      label: "Data coverage",
      value: summary.totalMeters
        ? `${summary.currentMeters} of ${summary.totalMeters}`
        : "No meters",
      unit: summary.totalMeters ? "meters" : "",
      title: "Current meter readings",
      detail: summary.totalMeters
        ? `${summary.totalMeters - summary.currentMeters} meter readings are overdue`
        : "Add meters and readings to track coverage",
    },
    {
      label: "Report readiness",
      value: `${summary.readyProperties} of ${properties.length}`,
      unit: "properties",
      title: "Properties ready to report",
      detail: "Simulated readiness, not official eligibility",
    },
  ]

  return (
    <>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="outline">Simulated data</Badge>Performance and readiness
        values are for the prototype.
      </p>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card
            key={card.label}
            className="rounded-2xl bg-linear-to-br from-primary/5 to-card"
          >
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold tabular-nums">
                {card.value}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  {card.unit}
                </span>
              </p>
            </CardContent>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <PortfolioPerformanceChart
        performance={summary}
        metric={metric}
        months={months}
        onMetricChange={setMetric}
        onMonthsChange={setMonths}
      />
      <PortfolioPropertiesTable
        properties={properties}
        metrics={summary.propertyMetrics}
      />
    </>
  )
}
