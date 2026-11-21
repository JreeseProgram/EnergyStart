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
import { EnergyMeterDetailsCell } from "@/features/portfolio/cells/energy-meter-details.cell"
import { EnergyReadingForm } from "@/features/portfolio/forms/energy-reading.form"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"

export function EnergyReadingModal({
  handle,
  propertyName,
  children,
  finalFocus,
}: {
  handle: ReturnType<typeof createDialogHandle<EnergyMeter>>
  propertyName: string
  children?: ReactNode
  finalFocus?: RefObject<HTMLElement | null>
}) {
  const actions = useRef<DialogPrimitive.Root.Actions | null>(null)
  const close = () => actions.current?.close()
  return (
    <Dialog handle={handle} actionsRef={actions}>
      {({ payload: meter }) => (
        <>
          {children}
          {meter && (
            <DialogContent
              finalFocus={finalFocus}
              className="max-h-[85vh] overflow-y-auto sm:max-w-xl"
            >
              <DialogHeader>
                <DialogTitle>Add reading</DialogTitle>
                <DialogDescription>
                  {meter.meterName || "Unnamed meter"} · {propertyName} ·{" "}
                  {meter.unitOfMeasure.replaceAll("_", " ")}
                </DialogDescription>
              </DialogHeader>
              <EnergyMeterDetailsCell
                key={meter.meterId}
                propertyId={meter.propertyId}
                energyMeterId={meter.meterId}
              >
                {(loadedMeter) => (
                  <EnergyReadingForm
                    meter={loadedMeter}
                    onSuccess={close}
                    onCancel={close}
                  />
                )}
              </EnergyMeterDetailsCell>
            </DialogContent>
          )}
        </>
      )}
    </Dialog>
  )
}
