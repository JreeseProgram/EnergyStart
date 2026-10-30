import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { paths } from "@/config/paths"
import type { BuildingUse } from "@/features/portfolio/models/building-use.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { PROPERTY_TYPES } from "@/features/portfolio/utils/form-constants"
import { Link } from "react-router"

export function PropertyBuildingUseSummary({
  propertyId,
  buildingUses,
}: {
  propertyId: PropertyId
  buildingUses: BuildingUse[]
}) {
  const uses = buildingUses.filter((use) => use.propertyId === propertyId)
  const floorArea = uses.reduce((sum, use) => sum + use.grossFloorArea, 0)

  return (
    <Card className="rounded-2xl">
      <CardHeader spacing="between">
        <div>
          <CardTitle>Building uses</CardTitle>
          <CardDescription>
            {uses.length} {uses.length === 1 ? "use" : "uses"} ·{" "}
            {floorArea.toLocaleString("en-US")} sq ft combined
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          render={
            <Link to={paths.app.property.buildingUses.getHref(propertyId)} />
          }
        >
          View building uses
        </Button>
      </CardHeader>
      <CardContent>
        {uses.length === 0 ? (
          <div className="flex flex-col gap-2 py-6">
            <h3 className="font-semibold">No building uses yet</h3>
            <p className="text-sm text-muted-foreground">
              Building uses describe how space in this property is used. They
              will appear here once added.
            </p>
          </div>
        ) : (
          <Table>
            <TableCaption className="sr-only">
              Building uses belonging to the selected property
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Use type</TableHead>
                <TableHead scope="col" className="text-right">
                  Gross floor area
                </TableHead>
                <TableHead scope="col" className="text-right">
                  Year of construction
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uses.map((use) => (
                <TableRow key={use.id}>
                  <TableCell className="h-12">
                    {
                      PROPERTY_TYPES.find(
                        (type) => type.value === use.buildingUseType
                      )?.label
                    }
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {use.grossFloorArea.toLocaleString("en-US")} sq ft
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {use.yearOfConstruction || "Not available"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
