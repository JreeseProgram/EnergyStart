import { useId } from "react"

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "cn"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((label, index) => ({ label, value: String(index + 1).padStart(2, "0") }))

type MonthYearFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  disabled?: boolean
  hideLabel?: boolean
}

export function MonthYearField<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  hideLabel = false,
}: MonthYearFieldProps<T>) {
  const id = useId()
  const currentYear = new Date().getUTCFullYear()
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, index) => {
    const value = String(currentYear - index)
    return { label: value, value }
  })

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Keep partial selections in the field so form.reset() clears both.
        // The existing month schema rejects them until both parts are selected.
        const [year = "", month = ""] = String(field.value ?? "").split("-")

        return (
          <FieldSet disabled={disabled || field.disabled} className="gap-3">
            <FieldLegend variant="label" className={cn(hideLabel && "sr-only")}>
              {label}
            </FieldLegend>

            <div className="grid grid-cols-2 gap-3">
              {[
                { part: "month", label: "Month", value: month, items: months },
                { part: "year", label: "Year", value: year, items: years },
              ].map((select) => (
                <Field key={select.part} data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${id}-${select.part}`}>
                    {select.label} *
                  </FieldLabel>
                  <Select
                    value={select.value || null}
                    items={select.items}
                    disabled={disabled || field.disabled}
                    onValueChange={(value) => {
                      if (value === null) return
                      field.onChange(
                        select.part === "month"
                          ? `${year}-${value}`
                          : `${value}-${month}`
                      )
                    }}
                  >
                    <SelectTrigger
                      id={`${id}-${select.part}`}
                      ref={select.part === "month" ? field.ref : undefined}
                      onBlur={field.onBlur}
                      aria-required
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.error ? `${id}-error` : undefined
                      }
                      className="w-full"
                    >
                      <SelectValue placeholder={`Select ${select.part}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {select.items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              ))}
            </div>

            {fieldState.error && (
              <FieldError id={`${id}-error`} errors={[fieldState.error]} />
            )}
          </FieldSet>
        )
      }}
    />
  )
}
