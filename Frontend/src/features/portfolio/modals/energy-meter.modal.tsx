import { useRef, type ReactNode, type RefObject } from "react"
import type { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  createDialogHandle,
} from "@/components/ui/dialog"
import { EnergyMeterForm } from "@/features/portfolio/forms/energy-meter.form"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"

export function EnergyMeterModal({
  propertyId,
  handle,
  children,
  finalFocus,
}: {
  propertyId: PropertyId
  handle?: ReturnType<typeof createDialogHandle<EnergyMeter>>
  children?: ReactNode
  finalFocus?: RefObject<HTMLElement | null>
}) {
  const actions = useRef<DialogPrimitive.Root.Actions | null>(null)
  return (
    <Dialog handle={handle} actionsRef={actions}>
      {({ payload: meter }) => (
        <>
          {children}
          <DialogContent
            finalFocus={finalFocus}
            className="max-h-[85vh] overflow-y-auto sm:max-w-xl"
          >
            <DialogHeader>
              <DialogTitle>
                {meter ? "Edit meter" : "Add energy meter"}
              </DialogTitle>
              <DialogDescription>
                Set up a meter for this property. Readings use the units you
                select.
              </DialogDescription>
            </DialogHeader>
            <EnergyMeterForm
              key={meter?.meterId ?? "new"}
              propertyId={propertyId}
              meter={meter}
              onClose={() => actions.current?.close()}
            />
          </DialogContent>
        </>
      )}
    </Dialog>
  )
}
