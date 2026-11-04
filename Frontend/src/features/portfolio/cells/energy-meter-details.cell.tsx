import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { EnergyMeterTable } from "@/features/portfolio/components/energy-meter-table"
import { useEnergyMeter } from "@/features/portfolio/api/get-energy-meter.api"
import { EnergyReadingForm } from "@/features/portfolio/forms/energy-reading.form"
import type { GetEnergyMeterInput } from "@/features/portfolio/services/energy-meter.service"
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
        <EnergyMeterTable meter={meter} />
      </>
    ),
  })
}
