"use client"

import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field"
import { InputField } from "@/components/form/input-field"
import { toast } from "@/components/ui/toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useId, useRef, type PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { SelectField } from "@/components/form/select-field"
import { useCreateProperty } from "@/features/portfolio/api/property/create-property.api"
import { useUpdateProperty } from "@/features/portfolio/api/property/update-property.api"
import type { Property } from "@/features/portfolio/models/property.models"

import {
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyUpdateRefreshError,
  PropertyCreateRefreshError,
} from "@/features/portfolio/services/property.service"

import {
  PROPERTY_TYPES,
  STATES,
} from "@/features/portfolio/utils/form-constants"

const EditPropertyFormInput = UpdatePropertyInput.omit({ propertyId: true })
type PropertyFormInput = CreatePropertyInput

export function PropertyForm({
  onSuccess,
  onSubmittingChange,
  onSavedWithoutRefreshChange,
  children,
  property,
}: PropsWithChildren<{
  onSuccess: (data: Property) => void
  onSubmittingChange?: (isSubmitting: boolean) => void
  onSavedWithoutRefreshChange?: (saved: boolean) => void
  property?: Property
}>) {
  const form = useForm<PropertyFormInput>({
    resolver: zodResolver(
      property ? EditPropertyFormInput : CreatePropertyInput
    ),
    defaultValues: property
      ? {
          name: property.name ?? "",
          streetAddress: property.streetAddress ?? "",
          city: property.city ?? "",
          state: property.state ?? "",
          zip: property.zip ?? "",
        }
      : {},
  })

  const submissionLocked = useRef(false)
  const formId = useId()
  const createProperty = useCreateProperty()
  const updateProperty = useUpdateProperty()
  const mutation = property ? updateProperty : createProperty
  const isSubmitting = mutation.isPending
  const savedWithoutRefresh =
    mutation.error instanceof PropertyUpdateRefreshError ||
    mutation.error instanceof PropertyCreateRefreshError

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
  }, [isSubmitting, onSubmittingChange])

  useEffect(() => {
    onSavedWithoutRefreshChange?.(savedWithoutRefresh)
  }, [savedWithoutRefresh, onSavedWithoutRefreshChange])

  function onSubmit(data: PropertyFormInput) {
    if (submissionLocked.current || mutation.isPending || savedWithoutRefresh)
      return
    submissionLocked.current = true

    const options = {
      onError: (error: Error) => {
        if (
          !(error instanceof PropertyCreateRefreshError) &&
          !(error instanceof PropertyUpdateRefreshError)
        )
          submissionLocked.current = false
      },
      onSuccess: (savedProperty: Property) => {
        if (property) submissionLocked.current = false
        toast.add({
          type: "success",
          title: property ? "Property Updated" : "Property Created",
        })
        onSuccess(savedProperty)
      },
    }

    if (property) {
      const { name, streetAddress, city, state, zip } = data
      updateProperty.mutate(
        { name, streetAddress, city, state, zip, propertyId: property.id },
        options
      )
    } else createProperty.mutate(CreatePropertyInput.parse(data), options)
  }

  return (
    <form id={formId} onSubmit={(event) => form.handleSubmit(onSubmit)(event)}>
      <FieldSet disabled={isSubmitting}>
        <InputField
          control={form.control}
          name="name"
          label="Property name *"
          placeholder="e.g. Lake Eola Offices"
        />

        {property ? (
          <p className="text-sm text-muted-foreground">
            Primary Property Type:{" "}
            {PROPERTY_TYPES.find((item) => item.value === property.propertyType)
              ?.label ?? "Not specified"}
            . Property type is determined by building uses and cannot be changed
            here.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Property type is determined by building uses added after creation.
          </p>
        )}

        <InputField
          control={form.control}
          name="streetAddress"
          label="Street Address *"
          placeholder="123 Central Blvd"
        />

        <FieldGroup className="grid grid-cols-1 sm:grid-cols-8">
          <InputField
            control={form.control}
            name="city"
            label="City *"
            className="sm:col-span-4"
            placeholder="Orlando"
          />

          <SelectField
            control={form.control}
            name="state"
            label="State *"
            items={STATES}
            className="sm:col-span-2"
            placeholder="Florida"
          />

          <InputField
            control={form.control}
            inputMode="numeric"
            name="zip"
            label="ZIP code *"
            className="sm:col-span-2"
            placeholder="12345"
          />
        </FieldGroup>

        <p className="text-sm text-muted-foreground">
          ZIP codes are stored as whole numbers; leading zeros are not retained.
        </p>

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
