import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/form/submit-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldError } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { PropertySharingForm } from "@/features/portfolio/forms/property-sharing.form"
import { useRemovePropertyUser } from "@/features/portfolio/api/property-sharing.api"
import type {
  Property,
  PropertyAssignment,
} from "@/features/portfolio/models/property.models"

export function AddPropertyUserModal({ property }: { property: Property }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!pending) setOpen(next)
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
              <SubmitButton disabled={pending}>Add user</SubmitButton>
            </DialogFooter>
          </PropertySharingForm>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function RemovePropertyUserModal({
  property,
  assignment,
  onClose,
}: {
  property: Property
  assignment: PropertyAssignment
  onClose: () => void
}) {
  const mutation = useRemovePropertyUser()
  function remove() {
    if (mutation.isPending) return
    mutation.mutate(
      { propertyId: property.id, userId: assignment.user.id },
      {
        onSuccess: () => {
          toast.add({ type: "success", title: "Property access removed" })
          onClose()
        },
      }
    )
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) onClose()
      }}
    >
      <DialogContent showCloseButton={!mutation.isPending}>
        <DialogHeader>
          <DialogTitle>Remove property access?</DialogTitle>
          <DialogDescription>
            {assignment.user.email} will no longer be able to view or edit{" "}
            {property.name}.
          </DialogDescription>
        </DialogHeader>
        {mutation.isError && (
          <FieldError role="alert">
            {mutation.error.message ||
              "Unable to remove access. Please try again."}
          </FieldError>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            disabled={mutation.isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => void remove()}
          >
            {mutation.isPending ? "Removing…" : "Remove access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
