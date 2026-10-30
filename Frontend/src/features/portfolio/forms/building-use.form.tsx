import type z from "zod"
import { useEffect, useId, type ReactNode } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { SelectField } from "@/components/form/select-field"
import { toast } from "@/components/ui/toast"
import {
  BuildingUseDetails,
  BuildingUseType,
  type BuildingUse,
} from "@/features/portfolio/models/building-use.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { usePortfolioUser } from "@/features/portfolio/api/get-user.api"
import {
  useCreateBuildingUse,
  useUpdateBuildingUse,
} from "@/features/portfolio/api/save-building-use.api"
import { getBuildingUseFields } from "@/features/portfolio/utils/building-use-fields"
import { UserId } from "@/features/portfolio/models/user.models"
import { PROPERTY_TYPES } from "@/features/portfolio/utils/form-constants"
import { BuildingUseField } from "@/features/portfolio/components/building-use-field"

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
    resolver: zodResolver(BuildingUseDetails),
    defaultValues: buildingUse
      ? BuildingUseDetails.parse(buildingUse)
      : { propertyId },
  })

  const type = useWatch({ control: form.control, name: "buildingUseType" })
  const fields = getBuildingUseFields(type)
  const pending = form.formState.isSubmitting

  useEffect(() => {
    onSubmittingChange?.(pending)
  }, [pending, onSubmittingChange])

  async function submit(details: BuildingUseDetails) {
    if (pending || !user.data) return

    const input = { ...details, userId: UserId.parse(user.data.id) }

    try {
      if (buildingUse)
        await update.mutateAsync({ ...input, id: buildingUse.id })
      else await create.mutateAsync(input)
    } catch {
      return
    }

    toast.add({
      type: "success",
      title: buildingUse ? "Building use updated" : "Building use added",
    })

    onSuccess()
  }

  function changeType(next: BuildingUseType) {
    const nextNames = new Set(
      getBuildingUseFields(next).map((field) => field.name)
    )

    for (const field of fields) {
      if (!nextNames.has(field.name)) form.unregister(field.name)
    }

    form.setValue("buildingUseType", next)
    form.clearErrors()
    mutation.reset()
  }

  return (
    <form id={formId} onSubmit={form.handleSubmit(submit)} noValidate>
      <fieldset disabled={pending} className="grid gap-5">
        <SelectField
          control={form.control}
          name="buildingUseType"
          label="Use type *"
          items={PROPERTY_TYPES}
          placeholder="Select a use type"
          required
          errorMessage="Select a use type"
          onValueChange={(value) => {
            if (value) changeType(value as BuildingUseType)
          }}
        />

        <div className="grid grid-cols-2 gap-5">
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
          Unable to save building use. Please try again.
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
        canSubmit: !pending && Boolean(user.data),
      })}
    </form>
  )
}
