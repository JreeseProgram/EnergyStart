import type z from "zod"
import { BuildingUseSaveRefreshError } from "@/features/portfolio/services/building-use.service"
import { useEffect, useId, useRef, type ReactNode } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { SelectField } from "@/components/form/select-field"
import { toast } from "@/components/ui/toast"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { usePortfolioUser } from "@/features/portfolio/api/get-user.api"
import { getBuildingUseFields } from "@/features/portfolio/utils/building-use-fields"
import { UserId } from "@/features/portfolio/models/user.models"
import { BUILDING_USE_TYPES } from "@/features/portfolio/utils/form-constants"
import { BuildingUseField } from "@/features/portfolio/components/building-use-field"

import {
  BuildingUseDetails,
  BuildingUseFormDetails,
  BuildingUseType,
  type BuildingUse,
} from "@/features/portfolio/models/building-use.models"

import {
  useCreateBuildingUse,
  useUpdateBuildingUse,
} from "@/features/portfolio/api/save-building-use.api"

type BuildingUseFormState = {
  isSubmitting: boolean
  canSubmit: boolean
}

export function BuildingUseForm({
  propertyId,
  buildingUse,
  onSuccess,
  children,
  onSubmittingChange,
}: {
  propertyId: PropertyId
  buildingUse?: BuildingUse
  onSuccess: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
  children?: (state: BuildingUseFormState) => ReactNode
}) {
  const submissionLocked = useRef(false)
  const formId = useId()
  const user = usePortfolioUser()
  const create = useCreateBuildingUse()
  const update = useUpdateBuildingUse()
  const mutation = buildingUse ? update : create

  const form = useForm<
    z.input<typeof BuildingUseDetails>,
    unknown,
    BuildingUseDetails
  >({
    resolver: zodResolver(BuildingUseFormDetails),
    defaultValues: buildingUse
      ? BuildingUseDetails.parse(buildingUse)
      : { propertyId: propertyId },
  })

  const type = useWatch({ control: form.control, name: "buildingUseType" })
  const fields = getBuildingUseFields(type)
  const pending = mutation.isPending
  const savedWithoutRefresh =
    mutation.error instanceof BuildingUseSaveRefreshError

  useEffect(() => {
    onSubmittingChange?.(pending)
  }, [pending, onSubmittingChange])

  function submit(details: BuildingUseDetails) {
    if (
      submissionLocked.current ||
      pending ||
      savedWithoutRefresh ||
      !user.data
    ) {
      return
    }

    submissionLocked.current = true

    const input = { ...details, userId: UserId.parse(user.data.id) }
    const options = {
      onError: (error: Error) => {
        if (!(error instanceof BuildingUseSaveRefreshError)) {
          submissionLocked.current = false
        }
      },
      onSuccess: () => {
        toast.add({
          type: "success",
          title: buildingUse ? "Building use updated" : "Building use added",
        })
        onSuccess()
      },
    }

    if (buildingUse) {
      update.mutate({ ...input, id: buildingUse.id }, options)
    } else {
      create.mutate(input, options)
    }
  }

  function changeType(next: BuildingUseType) {
    if (submissionLocked.current || savedWithoutRefresh) return

    const nextNames = new Set(
      getBuildingUseFields(next).map((field) => field.name)
    )

    for (const field of fields) {
      if (!nextNames.has(field.name)) {
        form.unregister(field.name)
      }
    }

    form.setValue("buildingUseType", next)
    form.clearErrors()
    mutation.reset()
  }

  return (
    <form
      id={formId}
      onSubmit={(event) => void form.handleSubmit(submit)(event)}
      noValidate
    >
      <fieldset
        disabled={pending || savedWithoutRefresh}
        className="grid gap-5"
      >
        <SelectField
          control={form.control}
          name="buildingUseType"
          label="Use type *"
          items={BUILDING_USE_TYPES}
          placeholder="Select a use type"
          required
          errorMessage="Select a use type"
          onValueChange={(value) => {
            if (value) changeType(value as BuildingUseType)
          }}
          disabled={Boolean(buildingUse)}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {fields.map((definition) => (
            <BuildingUseField
              key={definition.name}
              control={form.control}
              definition={definition}
            />
          ))}
        </div>
      </fieldset>

      {mutation.isError && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {savedWithoutRefresh
            ? mutation.error.message
            : "Unable to save building use. Please try again."}
        </p>
      )}

      {user.isError && (
        <div role="alert" className="mt-4 text-sm text-destructive">
          Unable to load your user.{" "}
          <Button
            type="button"
            variant="link"
            onClick={() => void user.refetch()}
          >
            Retry
          </Button>
        </div>
      )}

      {children?.({
        isSubmitting: pending,
        canSubmit: !pending && !savedWithoutRefresh && Boolean(user.data),
      })}
    </form>
  )
}
