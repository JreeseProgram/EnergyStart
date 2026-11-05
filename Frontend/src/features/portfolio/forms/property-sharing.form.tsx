import { useEffect, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "@/components/form/input-field"
import { FieldError, FieldSet } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { useAddPropertyUser } from "@/features/portfolio/api/property-sharing.api"
import { AddPropertyUserInput } from "@/features/portfolio/services/property.service"
import type { PropertyId } from "@/features/portfolio/models/property.models"

const EmailInput = AddPropertyUserInput.pick({ email: true })

export function PropertySharingForm({
  propertyId,
  onSuccess,
  onSubmittingChange,
  children,
}: {
  propertyId: PropertyId
  onSuccess: () => void
  onSubmittingChange: (pending: boolean) => void
  children: ReactNode
}) {
  const mutation = useAddPropertyUser()

  const form = useForm<{ email: string }>({
    resolver: zodResolver(EmailInput),
    defaultValues: { email: "" },
  })

  const pending = mutation.isPending

  useEffect(() => onSubmittingChange(pending), [pending, onSubmittingChange])

  function onSubmit({ email }: { email: string }) {
    if (mutation.isPending) return

    mutation.mutate(
      { propertyId, email },
      {
        onSuccess: () => {
          toast.add({ type: "success", title: "Property access added" })
          onSuccess()
        },
      }
    )
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet disabled={pending}>
        <InputField
          control={form.control}
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
        />
        <p className="text-sm text-muted-foreground">
          This user will be able to view and edit this property. Only the owner
          can manage sharing.
        </p>
        {mutation.isError && (
          <FieldError role="alert">
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Unable to add user. Please try again."}
          </FieldError>
        )}
      </FieldSet>
      {children}
    </form>
  )
}
