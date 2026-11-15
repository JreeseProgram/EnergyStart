import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
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
  reportEuiLabel,
  reportDateLabel,
} from "@/features/portfolio/utils/energy-report-labels"

export function EnergyReportDetails({ report }: { report: EnergyReport }) {
  const property = report.propertySnapshot
  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Property at generation</dt>
          <dd className="mt-1 font-medium">
            {property.name || "Property name unavailable"}
          </dd>
          <dd>
            {[
              property.streetAddress,
              property.city,
              property.state,
              property.zip,
            ]
              .filter(Boolean)
              .join(", ") || "Address unavailable"}
          </dd>
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
          <dd className="mt-1">{reportDateLabel(report.generatedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Floor area used</dt>
          <dd className="mt-1">
            {report.snapshot.floorAreaSqFt.toLocaleString("en-US")} sq ft
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">History as of</dt>
          <dd className="mt-1">{reportDateLabel(report.snapshot.asOf)}</dd>
        </div>
      </dl>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Site EUI", reportEuiLabel(report.aggregateSiteEUI)],
          ["Source EUI", reportEuiLabel(report.aggregateSourceEUI)],
          ["Energy score", report.energyScore.toLocaleString("en-US")],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {report.disqualifiers.length > 0 && (
        <div className="text-sm">
          <h3 className="font-semibold">Energy score qualification</h3>
          <ul className="mt-2 list-disc pl-5">
            {report.disqualifiers.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        These results reflect the response received when this report was
        generated. Generate another report to see updated data.
      </p>
      <Table>
        <TableCaption>
          Monthly energy use intensity for the selected reporting period.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Month</TableHead>
            <TableHead scope="col" className="text-right">
              Site EUI (kBtu/ft²)
            </TableHead>
            <TableHead scope="col" className="text-right">
              Source EUI (kBtu/ft²)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {report.snapshot.monthlyPerformance.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>No monthly data available.</TableCell>
            </TableRow>
          )}
          {report.snapshot.monthlyPerformance.map((point) => (
            <TableRow key={point.month}>
              <TableCell>{reportMonthLabel(point.month.slice(0, 7))}</TableCell>
              <TableCell className="text-right tabular-nums">
                {point.siteEnergyKbtu.toLocaleString("en-US")}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {point.sourceEnergyKbtu.toLocaleString("en-US")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
