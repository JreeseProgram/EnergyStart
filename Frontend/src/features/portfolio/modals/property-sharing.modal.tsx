import { FieldError } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { useRemovePropertyUser } from "@/features/portfolio/api/property/remove-property-user.api"
import type { PropertyUser } from "@/features/portfolio/services/property.service"
import { useRef, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/form/submit-button"
import { PropertySharingForm } from "@/features/portfolio/forms/property-sharing.form"
import type { Property } from "@/features/portfolio/models/property.models"

import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza"

export function AddPropertyUserModal({ property }: { property: Property }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [shared, setShared] = useState(false)

  return (
    <Credenza
      open={open}
      onOpenChange={(next) => {
        if (!pending) {
          if (next) setShared(false)
          setOpen(next)
        }
      }}
    >
      <CredenzaTrigger render={<Button />}>
        Add new user
        <Plus />
      </CredenzaTrigger>
      <CredenzaContent showCloseButton={!pending}>
        <CredenzaHeader>
          <CredenzaTitle>Add new user</CredenzaTitle>
          <CredenzaDescription>
            Share {property.name} with a registered user.
          </CredenzaDescription>
        </CredenzaHeader>
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
            <CredenzaFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <SubmitButton disabled={pending || shared}>Add user</SubmitButton>
            </CredenzaFooter>
          </PropertySharingForm>
        )}
      </CredenzaContent>
    </Credenza>
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
    if (submissionLocked.current || mutation.isPending || mutation.isSuccess) {
      return
    }

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
    <Credenza
      open
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) onClose()
      }}
    >
      <CredenzaContent showCloseButton={!mutation.isPending}>
        <CredenzaHeader>
          <CredenzaTitle>
            {isSelf ? "Leave this property?" : "Remove property access?"}
          </CredenzaTitle>
          <CredenzaDescription>
            {isSelf
              ? `You will lose access to ${property.name ?? "this property"} and return to the property list. Another authorized user will need to add you again to restore access.`
              : `${user.email} will no longer be able to view or edit ${property.name ?? "this property"}.`}
          </CredenzaDescription>
        </CredenzaHeader>
        {mutation.isError && (
          <FieldError role="alert">
            {mutation.error.message ||
              "Unable to remove access. Please try again."}
          </FieldError>
        )}
        <CredenzaFooter>
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
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}
