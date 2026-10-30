import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import { useEnergyMeter } from "@/features/portfolio/api/energy-meters.api"
import { EnergyReadingForm } from "@/features/portfolio/forms/energy-reading.form"
import type { GetEnergyMeterInput } from "@/features/portfolio/services/energy-meter.service"
import { meterDate } from "@/features/portfolio/utils/energy-meter-labels"
import { createCell } from "@/lib/react-query"

export function EnergyMeterDetailsCell(input: GetEnergyMeterInput) {
  const query = useEnergyMeter(input)
  return createCell(query, {
    Loading: () => (
      <Skeleton
        className="h-64"
        role="status"
        aria-label="Loading meter readings"
      />
    ),
    Failure: ({ ctx }) => (
      <div role="alert">
        <p>Unable to load this meter.</p>
        <Button onClick={() => void ctx.refetch()}>Retry</Button>
      </div>
    ),
    Success: ({ data: meter }) => (
      <>
        <EnergyReadingForm meter={meter} />
        <Separator />
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
                      {meterDate(reading.startDate)} ?{" "}
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
    ),
  })
}
