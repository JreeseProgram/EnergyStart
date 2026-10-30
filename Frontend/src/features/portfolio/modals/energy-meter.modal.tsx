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
import { EnergyMeterForm } from "@/features/portfolio/forms/energy-meter.form"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"

export function EnergyMeterModal({
  propertyId,
  meter,
  ...props
}: DialogTriggerProps & { propertyId: PropertyId; meter?: EnergyMeter }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{meter ? "Edit meter" : "Add energy meter"}</DialogTitle>
          <DialogDescription>
            Set up a meter for this property. Readings use the units you select.
          </DialogDescription>
        </DialogHeader>
        <EnergyMeterForm
          key={open ? "open" : "closed"}
          propertyId={propertyId}
          meter={meter}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
