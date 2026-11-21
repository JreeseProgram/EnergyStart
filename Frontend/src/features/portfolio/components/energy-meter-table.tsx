import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import { meterDate } from "@/features/portfolio/utils/energy-meter-labels"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

export function EnergyMeterTable({
  meter,
  addReadingAction,
  onDeleteReading,
}: {
  onDeleteReading: (reading: EnergyMeter["readings"][number], trigger: HTMLElement) => void
  meter: EnergyMeter
  addReadingAction: ReactNode
}) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold">Monthly usage</h3>
        {meter.readings.length > 0 && addReadingAction}
      </div>

      {!meter.inUse && (
        <p className="text-sm text-muted-foreground">
          Activate this meter to add readings.
        </p>
      )}

      {meter.readings.length === 0 ? (
        <div className="flex flex-col items-start gap-3 py-4">
          <p className="text-sm text-muted-foreground">
            No readings yet. Add your first monthly reading.
          </p>
          {addReadingAction}
        </div>
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
              <TableHead><span className="sr-only">Actions</span></TableHead>
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
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" aria-label={`Delete reading for ${meterDate(reading.date)}`}
                      onClick={(event) => onDeleteReading(reading, event.currentTarget)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
