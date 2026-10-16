"use client"

import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field"
import { InputField } from "@/components/form/input-field"
import { toast } from "@/components/ui/toast"
import { CreatePropertyInput } from "@/features/portfolio/services/property.service"
import { zodResolver } from "@hookform/resolvers/zod"
import type { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { SelectField } from "@/components/form/select-field"
import {
  PROPERTY_TYPES,
  STATES,
} from "@/features/portfolio/utils/form-constants"
import { useCreateProperty } from "@/features/portfolio/api/create-property.api"
import { useUpdateProperty } from "@/features/portfolio/api/update-property.api"
import type { Property } from "@/features/portfolio/models/property.models"

export function PropertyForm({
  onSuccess,
  children,
  property,
}: PropsWithChildren<{
  onSuccess: (data: ReturnType<typeof useCreateProperty>["data"]) => void
  property?: Property
}>) {
  const form = useForm<CreatePropertyInput>({
    resolver: zodResolver(CreatePropertyInput),
    defaultValues: { ...property },
  })

  const createProperty = useCreateProperty()
  const updateProperty = useUpdateProperty()
  const mutation = property ? updateProperty : createProperty

  async function onSubmit(data: CreatePropertyInput) {
    if (mutation.isPending) return

    let savedProperty: Property
    try {
      savedProperty = property
        ? await updateProperty.mutateAsync({ ...data, propertyId: property.id })
        : await createProperty.mutateAsync(data)
    } catch {
      // The mutation keeps the error available for the form's feedback below.
      return
    }

    toast.add({
      type: "success",
      title: property ? "Property Updated" : "Property Created",
    })
    onSuccess(savedProperty)
  }

  return (
    <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet disabled={form.formState.isSubmitting}>
        <InputField
          control={form.control}
          name="name"
          label="Property name *"
          placeholder="e.g. Lake Eola Offices"
        />

        <SelectField
          control={form.control}
          name="propertyType"
          label="Primary Property Type *"
          items={PROPERTY_TYPES}
          placeholder="Select a property type"
        />

        <InputField
          control={form.control}
          name="streetAddress"
          label="Street Address *"
          placeholder="123 Central Blvd"
        />

        <FieldGroup className="grid grid-cols-8">
          <InputField
            control={form.control}
            name="city"
            label="City *"
            className="col-span-4"
            placeholder="Orlando"
          />

          <SelectField
            control={form.control}
            name="state"
            label="State *"
            items={STATES}
            className="col-span-2"
            placeholder="Florida"
          />

          <InputField
            control={form.control}
            inputMode="numeric"
            name="zip"
            label="ZIP code *"
            className="col-span-2"
            placeholder="12345"
          />
        </FieldGroup>
        {mutation.isError && (
          <FieldGroup>
            <FieldError>
              {mutation.error?.message ||
                "Unable to save property. Please try again."}
            </FieldError>
          </FieldGroup>
        )}
      </FieldSet>
      {children}
    </form>
  )
}
