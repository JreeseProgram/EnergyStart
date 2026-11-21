import { useEffect, useRef, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "@/components/form/input-field"
import { FieldError, FieldSet } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { useAddPropertyUser } from "@/features/portfolio/api/property/add-property-user.api"
import type { PropertyId } from "@/features/portfolio/models/property.models"

import {
  AddPropertyUserInput,
  PropertyShareRefreshError,
} from "@/features/portfolio/services/property.service"

const EmailInput = AddPropertyUserInput.pick({ email: true })

export function PropertySharingForm({
  propertyId,
  onSuccess,
  onSubmittingChange,
  onSharedChange,
  children,
}: {
  propertyId: PropertyId
  onSuccess: () => void
  onSubmittingChange: (pending: boolean) => void
  onSharedChange: (shared: boolean) => void
  children: ReactNode
}) {
  const mutation = useAddPropertyUser()
  const submissionLocked = useRef(false)

  const form = useForm<{ email: string }>({
    resolver: zodResolver(EmailInput),
    defaultValues: { email: "" },
  })

  const pending = mutation.isPending
  const shared =
    mutation.isSuccess || mutation.error instanceof PropertyShareRefreshError

  useEffect(() => onSubmittingChange(pending), [pending, onSubmittingChange])
  useEffect(() => onSharedChange(shared), [shared, onSharedChange])

  function onSubmit({ email }: { email: string }) {
    if (submissionLocked.current || pending || shared) return
    submissionLocked.current = true

    mutation.mutate(
      { propertyId, email },
      {
        onError: (error) => {
          if (!(error instanceof PropertyShareRefreshError))
            submissionLocked.current = false
        },
        onSuccess: () => {
          toast.add({ type: "success", title: "Property access added" })
          onSuccess()
        },
      }
    )
  }

  return (
    <form noValidate onSubmit={(event) => form.handleSubmit(onSubmit)(event)}>
      <FieldSet disabled={pending || shared}>
        <InputField
          control={form.control}
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
        />
        <p className="text-sm text-muted-foreground">
          This user will be able to view and edit this property and manage
          sharing.
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
