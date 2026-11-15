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
          No readings yet. Record the first month above.
        </p>
      ) : (
        <Table>
          <TableCaption>
            Usage is recorded in {meter.unitOfMeasure}. Each month can have one
            reading.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Usage</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...meter.readings]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>{meterDate(reading.date)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {reading.usage.toLocaleString("en-US")}{" "}
                    {meter.unitOfMeasure}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {reading.cost.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
