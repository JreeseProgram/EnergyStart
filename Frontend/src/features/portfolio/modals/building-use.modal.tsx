import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza"
import { BuildingUseForm } from "@/features/portfolio/forms/building-use.form"
import type { BuildingUse } from "@/features/portfolio/models/building-use.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { SubmitButton } from "@/components/form/submit-button"

export function BuildingUseModal({
  propertyId,
  buildingUse,
  onClose,
}: {
  propertyId: PropertyId
  buildingUse?: BuildingUse
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)

  // These modals mount on demand; start closed so Base UI runs its entrance transition.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const close = () => setOpen(false)
  const [pending, setPending] = useState(false)
  const action = buildingUse ? "Edit" : "Create"

  return (
    <Credenza
      open={open}
      onOpenChange={(next, event) => {
        if (!next && pending) event.cancel()
        else setOpen(next)
      }}
      onOpenChangeComplete={(next) => {
        if (!next) onClose()
      }}
    >
      <CredenzaContent
        dialogClassName="sm:max-w-2xl"
        showCloseButton={!pending}
      >
        <CredenzaHeader>
          <CredenzaTitle>{action} building use</CredenzaTitle>
          <CredenzaDescription>
            Describe how this space is used. All fields are required.
          </CredenzaDescription>
        </CredenzaHeader>
        <BuildingUseForm
          propertyId={propertyId}
          buildingUse={buildingUse}
          onSuccess={close}
          onSubmittingChange={setPending}
        >
          {({ isSubmitting, canSubmit }) => (
            <CredenzaFooter className="mt-6 border-t pt-5">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={close}
              >
                Cancel
              </Button>
              <SubmitButton disabled={!canSubmit}>
                {buildingUse ? "Save changes" : "Add building use"}
              </SubmitButton>
            </CredenzaFooter>
          )}
        </BuildingUseForm>
      </CredenzaContent>
    </Credenza>
  )
}
