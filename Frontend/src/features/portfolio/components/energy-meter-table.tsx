import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import { meterDate } from "@/features/portfolio/utils/energy-meter-labels"

export function EnergyMeterTable({ meter }: { meter: EnergyMeter }) {
  return (
    <>
      <h3 className="font-semibold">Reading history</h3>
      {meter.readings.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No readings yet. Record the first period above.
        </p>
      ) : (
        <Table>
          <TableCaption>
            Usage is recorded in {meter.unitOfMeasure}. Periods must not
            overlap.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Usage</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...meter.readings]
              .sort((a, b) => b.endDate.localeCompare(a.endDate))
              .map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>
                    {meterDate(reading.startDate)} to{" "}
                    {meterDate(reading.endDate)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {reading.usage.toLocaleString("en-US")}{" "}
                    {meter.unitOfMeasure}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {reading.cost?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) ?? "Not entered"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
