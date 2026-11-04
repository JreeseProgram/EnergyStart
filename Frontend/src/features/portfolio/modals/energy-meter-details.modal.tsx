import { useState } from "react"
import type { DialogTriggerProps } from "@base-ui/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EnergyMeterDetailsCell } from "@/features/portfolio/cells/energy-meter-details.cell"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"

export function EnergyMeterDetailsModal({
  meter,
  ...props
}: DialogTriggerProps & { meter: EnergyMeter }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{meter.meterId || "Energy meter"}</DialogTitle>
          <DialogDescription>
            Review and record usage for this property meter. Entries use{" "}
            {meter.unitOfMeasure}.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <EnergyMeterDetailsCell
            propertyId={meter.propertyId}
            energyMeterId={meter.id}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
