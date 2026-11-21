import { useEffect, useId, useState, useRef, type RefObject } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnergyMeterDetailsCell } from "@/features/portfolio/cells/energy-meter-details.cell"
import { EnergyMeterTable } from "@/features/portfolio/components/energy-meter-table"
import { EnergyReadingForm } from "@/features/portfolio/forms/energy-reading.form"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  createDialogHandle,
} from "@/components/ui/dialog"

export function EnergyMeterHistoryModal({
  handle,
  propertyName,
  finalFocus,
}: {
  handle: ReturnType<typeof createDialogHandle<EnergyMeter>>
  propertyName: string
  finalFocus: RefObject<HTMLElement | null>
}) {
  return (
    <Dialog handle={handle}>
      {({ payload: meter }) =>
        meter && (
          <DialogContent
            finalFocus={finalFocus}
            className="max-h-[85vh] overflow-y-auto sm:max-w-3xl"
          >
            <DialogHeader>
              <DialogTitle>Reading history</DialogTitle>
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
                <EnergyMeterHistoryContent
                  key={loadedMeter.meterId}
                  meter={loadedMeter}
                />
              )}
            </EnergyMeterDetailsCell>
          </DialogContent>
        )
      }
    </Dialog>
  )
}

function EnergyMeterHistoryContent({ meter }: { meter: EnergyMeter }) {
  const [isAdding, setIsAdding] = useState(false)
  const readingTriggerRef = useRef<HTMLButtonElement | null>(null)
  const restoreFocus = useRef(false)
  const formTitleId = useId()

  useEffect(() => {
    if (!isAdding && restoreFocus.current) {
      restoreFocus.current = false
      readingTriggerRef.current?.focus()
    }
  }, [isAdding])

  function closeForm() {
    restoreFocus.current = true
    setIsAdding(false)
  }

  return (
    <>
      {isAdding && (
        <section
          aria-labelledby={formTitleId}
          className="space-y-4 rounded-lg border p-4"
        >
          <h3 id={formTitleId} className="font-semibold">
            Add reading
          </h3>
          <EnergyReadingForm
            meter={meter}
            onSuccess={closeForm}
            onCancel={closeForm}
          />
        </section>
      )}

      <EnergyMeterTable
        meter={meter}
        addReadingAction={
          !isAdding && (
            <Button
              ref={readingTriggerRef}
              size="sm"
              disabled={!meter.inUse}
              onClick={() => setIsAdding(true)}
            >
              <Plus /> Add reading
            </Button>
          )
        }
      />
    </>
  )
}
