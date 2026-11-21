import { SubmitButton } from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PropertyForm } from "@/features/portfolio/forms/property.form"
import type { Property } from "@/features/portfolio/models/property.models"
import type { Drawer } from "@base-ui/react/drawer"
import { useState } from "react"

import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza"

export function PropertyModal({
  property,
  ...props
}: Omit<Drawer.Trigger.Props, "property"> & { property?: Property }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [savedWithoutRefresh, setSavedWithoutRefresh] = useState(false)
  const action = property ? "Edit" : "Create"

  return (
    <Credenza
      open={open}
      onOpenChange={(nextOpen) => {
        if (!pending) setOpen(nextOpen)
      }}
    >
      <CredenzaContent
        dialogClassName="sm:max-w-2xl"
        showCloseButton={!pending}
      >
        <CredenzaHeader>
          <CredenzaTitle>{action} Property</CredenzaTitle>
          <CredenzaDescription>
            {property
              ? "Update the details for this property."
              : "Create a property and add buildings after it is saved."}
          </CredenzaDescription>
        </CredenzaHeader>

        <PropertyForm
          onSubmittingChange={setPending}
          onSavedWithoutRefreshChange={setSavedWithoutRefresh}
          onSuccess={() => {
            setPending(false)
            setOpen(false)
          }}
          key={property?.id ?? "create"}
          property={property}
        >
          <Separator className={"my-6"} />
          <CredenzaFooter>
            <Button
              variant={"outline"}
              type="button"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <SubmitButton disabled={pending || savedWithoutRefresh}>
              {property ? "Save changes" : "Create property"}
            </SubmitButton>
          </CredenzaFooter>
        </PropertyForm>
      </CredenzaContent>
      <CredenzaTrigger {...props} />
    </Credenza>
  )
}
