import { useState } from "react"
import type { Property } from "@/features/portfolio/models/property.models"
import type { PortfolioPerformance } from "@/features/portfolio/models/portfolio-performance.models"
import { PortfolioPropertiesTable } from "@/features/portfolio/components/portfolio-properties-table"
import { PortfolioPerformanceChart } from "@/features/portfolio/components/portfolio-performance-chart"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  getPortfolioPerformance,
  type PortfolioMetric,
  type PortfolioMonths,
} from "@/features/portfolio/utils/get-portfolio-performance"
import { CardGrid } from "@/components/card-grid"
import { Badge } from "@/components/ui/badge"

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

  // Both counts must be available to show coverage and overdue readings;
  // this distinguishes missing data from a valid count of zero meters.
  const hasTotalAndCurrentMeterCounts =
    summary.totalMeters !== null && summary.currentMeters !== null

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
      value: !hasTotalAndCurrentMeterCounts
        ? "No data"
        : summary.totalMeters
          ? `${summary.currentMeters} of ${summary.totalMeters}`
          : "No meters",
      unit:
        hasTotalAndCurrentMeterCounts && summary.totalMeters ? "meters" : "",
      title: "Current meter readings",
      detail: !hasTotalAndCurrentMeterCounts
        ? "Meter coverage is unavailable"
        : summary.totalMeters
          ? `${summary.totalMeters - summary.currentMeters!} meter readings are overdue`
          : "Add meters and readings to track coverage",
    },
    {
      label: "Portfolio site EUI",
      value:
        summary.period.siteEui === null
          ? "No data"
          : summary.period.siteEui.toLocaleString("en-US", {
              maximumFractionDigits: 1,
            }),
      unit: summary.period.siteEui === null ? "" : "kBtu/ft²",
      title: "Energy use per square foot",
      detail:
        summary.period.siteEui === null
          ? "No performance history is available for this period."
          : `Selected ${months}-month period · ${summary.propertiesWithHistory} ${summary.propertiesWithHistory === 1 ? "property" : "properties"} with performance history`,
    },
  ]

  return (
    <>
      <CardGrid>
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <Badge variant={"outline"}>{card.label}</Badge>
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
      </CardGrid>

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
