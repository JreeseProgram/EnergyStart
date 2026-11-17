import { FieldError } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { useRemovePropertyUser } from "@/features/portfolio/api/property-sharing.api"
import type { PropertyUser } from "@/features/portfolio/services/property.service"
import { useRef, useState } from "react"
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

export function RemovePropertyUserModal({
  property,
  user,
  isSelf,
  onClose,
}: {
  property: Property
  user: PropertyUser
  isSelf: boolean
  onClose: () => void
}) {
  const mutation = useRemovePropertyUser()
  const submissionLocked = useRef(false)
  function remove() {
    if (submissionLocked.current || mutation.isPending || mutation.isSuccess)
      return
    submissionLocked.current = true
    mutation.mutate(
      { propertyId: property.id, userId: user.userId },
      {
        onSuccess: () => {
          toast.add({ type: "success", title: "Property access removed" })
          onClose()
        },
        onError: () => {
          submissionLocked.current = false
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
          <DialogTitle>
            {isSelf ? "Leave this property?" : "Remove property access?"}
          </DialogTitle>
          <DialogDescription>
            {isSelf
              ? `You will lose access to ${property.name ?? "this property"} and return to the property list. Another authorized user will need to add you again to restore access.`
              : `${user.email} will no longer be able to view or edit ${property.name ?? "this property"}.`}
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
            disabled={mutation.isPending || mutation.isSuccess}
            onClick={remove}
          >
            {mutation.isPending
              ? "Removing…"
              : isSelf
                ? "Leave property"
                : "Remove access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
