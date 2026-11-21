import { useRef, type ReactNode, type RefObject } from "react"
import type { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  createCredenzaHandle,
} from "@/components/ui/credenza"
import { EnergyMeterDetailsCell } from "@/features/portfolio/cells/energy-meter-details.cell"
import { EnergyReadingForm } from "@/features/portfolio/forms/energy-reading.form"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"

export function EnergyReadingModal({
  handle,
  propertyName,
  children,
  finalFocus,
}: {
  handle: ReturnType<typeof createCredenzaHandle<EnergyMeter>>
  propertyName: string
  children?: ReactNode
  finalFocus?: RefObject<HTMLElement | null>
}) {
  const actions = useRef<DialogPrimitive.Root.Actions | null>(null)
  const close = () => actions.current?.close()

  return (
    <Credenza handle={handle} actionsRef={actions}>
      {({ payload: meter }) => (
        <>
          {children}
          {meter && (
            <CredenzaContent
              finalFocus={finalFocus}
              dialogClassName="sm:max-w-xl"
            >
              <CredenzaHeader>
                <CredenzaTitle>Add reading</CredenzaTitle>
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
                  <EnergyReadingForm
                    meter={loadedMeter}
                    onSuccess={close}
                    onCancel={close}
                  />
                )}
              </EnergyMeterDetailsCell>
            </CredenzaContent>
          )}
        </>
      )}
    </Credenza>
  )
}
