import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { paths } from "@/config/paths"
import type { Property } from "@/features/portfolio/models/property.models"
import { Link } from "react-router"

export function PropertyOverview({ property }: { property: Property }) {
  const score =
    property.energyStarScore > 0 ? property.energyStarScore : undefined
  const metrics = [
    {
      label: "Energy Star Score",
      value: score,
      unit: "",
      title: "Property score",
      description:
        score === undefined
          ? "No score is available yet"
          : "Score supplied for this property",
    },
    {
      label: "Site EUI",
      value: property.siteEui,
      unit: "kBtu/ft²",
      title: "Site energy intensity",
      description: "Site energy used per square foot",
    },
    {
      label: "Source EUI",
      value: property.sourceEui,
      unit: "kBtu/ft²",
      title: "Source energy intensity",
      description: "Source energy used per square foot",
    },
    {
      label: "Energy use",
      value: property.energyUse,
      unit: "kBtu",
      title: "Property energy use",
      description: "Energy total supplied for this property",
    },
  ]
  const hasPerformance = metrics.some((metric) => metric.value !== undefined)

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Prototype metrics · Reporting year {property.reportingYear}. Values come
        from the property data and are not official report results.
      </p>
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            className="rounded-2xl bg-linear-to-br from-primary/5 to-card"
          >
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold tabular-nums">
                {metric.value === undefined
                  ? "No data"
                  : metric.value.toLocaleString("en-US", {
                      maximumFractionDigits: 1,
                    })}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {metric.value === undefined ? "" : metric.unit}
                </span>
              </p>
            </CardContent>
            <CardHeader>
              <CardTitle>{metric.title}</CardTitle>
              <CardDescription>
                {metric.value === undefined
                  ? "Add property data to see this metric"
                  : metric.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      {!hasPerformance && (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold">No performance data yet</h3>
          <p className="text-sm text-muted-foreground">
            Start with this property’s building uses and energy meters. Metrics
            will appear when performance data is available.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              render={
                <Link
                  to={paths.app.property.buildingUses.getHref(property.id)}
                />
              }
            >
              View building uses
            </Button>
            <Button
              variant="outline"
              render={
                <Link
                  to={paths.app.property.energyMeters.getHref(property.id)}
                />
              }
            >
              View energy meters
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
