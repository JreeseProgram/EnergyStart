import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Property } from "@/features/portfolio/models/property.models"
import { PortfolioPropertiesTable } from "@/features/portfolio/components/portfolio-properties-table"

export function PortfolioDashboard({ properties }: { properties: Property[] }) {
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-linear-to-br from-primary/5 to-card">
          <CardHeader>
            <CardDescription>Portfolio size</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tabular-nums">
              {properties.length}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {properties.length === 1 ? "property" : "properties"}
              </span>
            </p>
          </CardContent>
          <CardHeader>
            <CardTitle>Portfolio size</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <PortfolioPropertiesTable properties={properties} />
    </>
  )
}
