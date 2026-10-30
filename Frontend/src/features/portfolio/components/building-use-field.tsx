import type z from "zod"
import type { Control, FieldPath } from "react-hook-form"
import { InputField } from "@/components/form/input-field"
import { SelectField } from "@/components/form/select-field"
import type { BuildingUseDetails } from "@/features/portfolio/models/building-use.models"

export type BuildingUseField = {
  name: FieldPath<BuildingUseDetails>
  label: string
  kind: "number" | "boolean" | "enum"
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number | "any"
}

export function BuildingUseField({
  control,
  definition,
}: {
  control: Control<
    z.input<typeof BuildingUseDetails>,
    unknown,
    BuildingUseDetails
  >
  definition: BuildingUseField
}) {
  const { name, label, kind } = definition

  if (kind === "number") {
    return (
      <InputField
        control={control}
        name={name}
        label={label + " *"}
        type="number"
        min={definition.min}
        max={definition.max}
        step={definition.step}
        aria-required
        formatValue={(value) => (typeof value === "number" ? value : "")}
        parseValue={(value) => (value === "" ? undefined : Number(value))}
      />
    )
  }

  return (
    <SelectField
      control={control}
      name={name}
      label={label + " *"}
      required
      items={
        kind === "boolean"
          ? [
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]
          : (definition.options ?? [])
      }
      placeholder="Select an option"
      errorMessage="Select an option"
      formatValue={(value) => (value === undefined ? null : String(value))}
      parseValue={(value) =>
        value === null
          ? undefined
          : kind === "boolean"
            ? value === "true"
            : value
      }
    />
  )
}
