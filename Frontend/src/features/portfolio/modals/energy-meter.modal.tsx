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
  handle?: ReturnType<typeof createCredenzaHandle<EnergyMeter>>
  children?: ReactNode
  finalFocus?: RefObject<HTMLElement | null>
}) {
  const actions = useRef<DialogPrimitive.Root.Actions | null>(null)

  return (
    <Credenza handle={handle} actionsRef={actions}>
      {({ payload: meter }) => (
        <>
          {children}
          <CredenzaContent
            finalFocus={finalFocus}
            dialogClassName="sm:max-w-xl"
          >
            <CredenzaHeader>
              <CredenzaTitle>
                {meter ? "Edit meter" : "Add energy meter"}
              </CredenzaTitle>
              <CredenzaDescription>
                Set up a meter for this property. Readings use the units you
                select.
              </CredenzaDescription>
            </CredenzaHeader>
            <EnergyMeterForm
              key={meter?.meterId ?? "new"}
              propertyId={propertyId}
              meter={meter}
              onClose={() => actions.current?.close()}
            />
          </CredenzaContent>
        </>
      )}
    </Credenza>
  )
}
