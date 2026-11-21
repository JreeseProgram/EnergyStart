import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { ReactNode } from "react"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import { useEnergyMeter } from "@/features/portfolio/api/energy-meter/get-energy-meter.api"
import type { GetEnergyMeterInput } from "@/features/portfolio/services/energy-meter.service"
import { createCell } from "@/lib/react-query"

export function EnergyMeterDetailsCell({
  children,
  ...input
}: GetEnergyMeterInput & {
  children: (meter: EnergyMeter) => ReactNode
}) {
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
    Success: ({ data: meter }) => children(meter),
  })
}
