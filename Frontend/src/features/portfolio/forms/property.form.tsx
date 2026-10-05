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

  // Todo: Update mutation to use UPDATE mutation whenever a property exists.
  const createProperty = useCreateProperty({
    mutationConfig: {
      onSuccess: (data) => {
        toast.add({
          type: "success",
          title: "Property Created",
        })
        onSuccess(data)
      },
    },
  })

  async function onSubmit(data: CreatePropertyInput) {
    await createProperty.mutateAsync(data)
  }

  return (
    <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <InputField
          control={form.control}
          name="name"
          label="Name"
          placeholder="e.g. Lake Eola Offices *"
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
            label="City"
            className="col-span-4"
            placeholder="Orlando"
          />

          <SelectField
            control={form.control}
            name="state"
            label="State"
            items={STATES}
            className="col-span-2"
            placeholder="Florida"
          />

          <InputField
            control={form.control}
            type="number"
            name="zip"
            label="Zip"
            className="col-span-2"
            placeholder="12345"
          />
        </FieldGroup>
        {createProperty.isError && (
          <FieldGroup>
            <FieldError>{JSON.stringify(createProperty.error)}</FieldError>
          </FieldGroup>
        )}
      </FieldSet>
      {children}
    </form>
  )
}
