import { SubmitButton } from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

import { PropertyForm } from "@/features/portfolio/forms/property.form"
import type { Property } from "@/features/portfolio/models/property.models"
import type { DialogTriggerProps } from "@base-ui/react"
import { useState } from "react"

export function PropertyModal({
  property,
  ...props
}: Omit<DialogTriggerProps, "property"> & { property?: Property }) {
  const [open, setOpen] = useState(false)
  const action = property ? "Edit" : "Create"
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={"sm:max-w-2xl"}>
        <DialogHeader>
          <DialogTitle>{action} Property</DialogTitle>
          <DialogDescription>
            {action} a property and add buildings after it is saved.
          </DialogDescription>
        </DialogHeader>
        <PropertyForm
          onSuccess={() => {
            setOpen(false)
          }}
          property={property}
        >
          <Separator className={"my-6"} />
          <DialogFooter>
            <Button
              variant={"outline"}
              type="button"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            <SubmitButton>Submit</SubmitButton>
          </DialogFooter>
        </PropertyForm>
      </DialogContent>
      <DialogTrigger {...props} />
    </Dialog>
  )
}
