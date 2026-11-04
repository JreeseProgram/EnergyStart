import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import type { EnergyReport } from "@/features/portfolio/models/energy-report.models"
import {
  reportMonthLabel,
  reportResultLabel,
  reportTypeLabel,
} from "@/features/portfolio/utils/energy-report-labels"
import { meterDate } from "@/features/portfolio/utils/energy-meter-labels"

export function EnergyReportDetails({ report }: { report: EnergyReport }) {
  const property = report.propertySnapshot
  let method =
    "Latest simulated score in the selected period; not an official ENERGY STAR assessment."
  if (report.reportType === "SITE_EUI")
    method =
      "Simulated site energy for the selected months divided by the saved floor area."
  if (report.reportType === "SOURCE_EUI")
    method =
      "Simulated source energy for the selected months divided by the saved floor area. Official source conversion factors are not applied."
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Badge variant="outline">Simulated result</Badge>
        <span className="text-sm text-muted-foreground">Saved snapshot</span>
      </div>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Property at generation</dt>
          <dd className="mt-1 font-medium">{property.name}</dd>
          <dd>
            {property.streetAddress}, {property.city}, {property.state}{" "}
            {property.zip}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Report type</dt>
          <dd className="mt-1">{reportTypeLabel(report.reportType)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Reporting period</dt>
          <dd className="mt-1">
            {reportMonthLabel(report.startMonth)} to{" "}
            {reportMonthLabel(report.endMonth)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Generated</dt>
          <dd className="mt-1">{meterDate(report.generatedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Floor area used</dt>
          <dd className="mt-1">
            {report.snapshot.floorAreaSqFt.toLocaleString("en-US")} sq ft
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">History as of</dt>
          <dd className="mt-1">{meterDate(report.snapshot.asOf)}</dd>
        </div>
      </dl>
      <Card>
        <CardHeader>
          <CardTitle>{reportTypeLabel(report.reportType)}</CardTitle>
          <CardDescription>{method}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tabular-nums">
            {reportResultLabel(report)}
          </p>
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">
        The result and inputs below were saved when this report was generated.
        Later changes to property data do not update this report.
      </p>
      <Table>
        <TableCaption>
          Saved simulated monthly inputs. These are separate from recorded meter
          readings.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Month</TableHead>
            <TableHead scope="col" className="text-right">
              Site energy (kBtu)
            </TableHead>
            <TableHead scope="col" className="text-right">
              Source energy (kBtu)
            </TableHead>
            <TableHead scope="col" className="text-right">
              Score
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {report.snapshot.monthlyPerformance.map((point) => (
            <TableRow key={point.month}>
              <TableCell>{reportMonthLabel(point.month.slice(0, 7))}</TableCell>
              <TableCell className="text-right tabular-nums">
                {point.siteEnergyKbtu.toLocaleString("en-US")}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {point.sourceEnergyKbtu.toLocaleString("en-US")}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {point.energyStarScore}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
