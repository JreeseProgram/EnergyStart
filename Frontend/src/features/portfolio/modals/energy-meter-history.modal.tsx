import { usePortfolioDeletion } from "@/features/portfolio/hooks/use-portfolio-deletion"
import { useEffect, useId, useState, useRef, type RefObject } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnergyMeterDetailsCell } from "@/features/portfolio/cells/energy-meter-details.cell"
import { EnergyMeterTable } from "@/features/portfolio/components/energy-meter-table"
import { EnergyReadingForm } from "@/features/portfolio/forms/energy-reading.form"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"

import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  createCredenzaHandle,
} from "@/components/ui/credenza"

export function EnergyMeterHistoryModal({
  handle,
  propertyName,
  finalFocus,
}: {
  handle: ReturnType<typeof createCredenzaHandle<EnergyMeter>>
  propertyName: string
  finalFocus: RefObject<HTMLElement | null>
}) {
  return (
    <Credenza handle={handle}>
      {({ payload: meter }) =>
        meter && (
          <CredenzaContent
            finalFocus={finalFocus}
            dialogClassName="sm:max-w-3xl"
          >
            <CredenzaHeader>
              <CredenzaTitle>Reading history</CredenzaTitle>
              <CredenzaDescription>
                {meter.meterName || "Unnamed meter"} · {propertyName} ·{" "}
                {meter.unitOfMeasure.replaceAll("_", " ")}
              </CredenzaDescription>
            </CredenzaHeader>

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
          </CredenzaContent>
        )
      }
    </Credenza>
  )
}

function EnergyMeterHistoryContent({ meter }: { meter: EnergyMeter }) {
  const { requestDelete, confirmation, successFocus } = usePortfolioDeletion()
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
      {confirmation}

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

      <div ref={successFocus} tabIndex={-1} aria-label="Reading history">
        <EnergyMeterTable
          meter={meter}
          onDeleteReading={(reading, trigger) =>
            requestDelete(
              {
                kind: "reading",
                propertyId: meter.propertyId,
                energyMeterId: meter.meterId,
                readingId: reading.id,
              },
              `the ${reading.date} reading for ${meter.meterName || "Unnamed meter"}`,
              trigger
            )
          }
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
      </div>
    </>
  )
}
