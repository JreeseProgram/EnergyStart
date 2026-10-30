import { useState } from "react"
import { Button } from "@/components/ui/button"
import { usePortfolioPerformance } from "@/features/portfolio/api/get-portfolio-performance.api"
import {
  PortfolioPerformanceChart,
  PerformanceChartSkeleton,
} from "@/features/portfolio/components/portfolio-performance-chart"
import type { PortfolioPerformance } from "@/features/portfolio/models/portfolio-performance.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import {
  getPortfolioPerformance,
  type PortfolioMetric,
  type PortfolioMonths,
} from "@/features/portfolio/utils/get-portfolio-performance"
import { createCell } from "@/lib/react-query"

export function PropertyPerformanceCell({
  propertyId,
}: {
  propertyId: PropertyId
}) {
  const query = usePortfolioPerformance({
    input: {
      propertyIds: [propertyId],
      asOf: new Date().toISOString().slice(0, 10),
    },
  })

  return createCell(query, {
    Loading: () => <PerformanceChartSkeleton />,
    Failure: ({ ctx }) => (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 rounded-xl border border-border p-6"
      >
        <p>Unable to load property performance. Please try again.</p>
        <Button variant="outline" onClick={() => void ctx.refetch()}>
          Retry
        </Button>
      </div>
    ),
    Success: ({ data }) => (
      <PropertyPerformanceTrend
        key={propertyId}
        propertyId={propertyId}
        performance={data}
      />
    ),
  })
}

function PropertyPerformanceTrend({
  propertyId,
  performance,
}: {
  propertyId: PropertyId
  performance: PortfolioPerformance
}) {
  const [metric, setMetric] = useState<PortfolioMetric>("siteEui")
  const [months, setMonths] = useState<PortfolioMonths>(12)
  const summary = getPortfolioPerformance(
    {
      ...performance,
      properties: performance.properties.filter(
        (property) => property.propertyId === propertyId
      ),
    },
    months
  )

  return (
    <PortfolioPerformanceChart
      scope="property"
      performance={summary}
      metric={metric}
      months={months}
      onMetricChange={setMetric}
      onMonthsChange={setMonths}
    />
  )
}
