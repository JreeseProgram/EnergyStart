import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/form/submit-button"
import { PropertySharingForm } from "@/features/portfolio/forms/property-sharing.form"
import type { Property } from "@/features/portfolio/models/property.models"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AddPropertyUserModal({ property }: { property: Property }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [shared, setShared] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!pending) {
          if (next) setShared(false)
          setOpen(next)
        }
      }}
    >
      <DialogTrigger render={<Button />}>
        Add new user
        <Plus />
      </DialogTrigger>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Add new user</DialogTitle>
          <DialogDescription>
            Share {property.name} with a registered user.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <PropertySharingForm
            propertyId={property.id}
            onSubmittingChange={setPending}
            onSharedChange={setShared}
            onSuccess={() => {
              setPending(false)
              setOpen(false)
            }}
          >
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <SubmitButton disabled={pending || shared}>Add user</SubmitButton>
            </DialogFooter>
          </PropertySharingForm>
        )}
      </DialogContent>
    </Dialog>
  )
}
