import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BuildingUseForm } from "@/features/portfolio/forms/building-use.form"
import type { BuildingUse } from "@/features/portfolio/models/building-use.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"

export function BuildingUseModal({
  propertyId,
  buildingUse,
  onClose,
}: {
  propertyId: PropertyId
  buildingUse?: BuildingUse
  onClose: () => void
}) {
  const [pending, setPending] = useState(false)
  const action = buildingUse ? "Edit" : "Create"

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !pending) onClose()
      }}
    >
      <DialogContent
        className="max-h-[85vh] overflow-y-auto sm:max-w-2xl"
        showCloseButton={!pending}
      >
        <DialogHeader>
          <DialogTitle>{action} building use</DialogTitle>
          <DialogDescription>
            Describe how this space is used. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <BuildingUseForm
          propertyId={propertyId}
          buildingUse={buildingUse}
          onSuccess={onClose}
          onSubmittingChange={setPending}
        >
          {({ isSubmitting, canSubmit }) => (
            <DialogFooter className="mt-6 border-t pt-5">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting
                  ? "Saving…"
                  : buildingUse
                    ? "Save changes"
                    : "Add building use"}
              </Button>
            </DialogFooter>
          )}
        </BuildingUseForm>
      </DialogContent>
    </Dialog>
  )
}
