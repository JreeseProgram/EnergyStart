import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useId } from "react"
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
} from "react-hook-form"

type FormInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  parseValue?: (
    value: string
  ) => FieldPathValue<TFieldValues, FieldPath<TFieldValues>> | undefined
  formatValue?: (
    value: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
  ) => string | number
} & Omit<
  React.ComponentProps<"input">,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref"
>

export function InputField<T extends FieldValues>({
  control,
  name,
  label,
  className,
  parseValue,
  formatValue,
  ...props
}: FormInputProps<T>) {
  const id = useId()
  const key = `${id}_${name}`
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={key}>{label}</FieldLabel>
          <Input
            {...field}
            value={formatValue ? formatValue(field.value) : field.value}
            onChange={(event) =>
              field.onChange(
                parseValue ? parseValue(event.target.value) : event.target.value
              )
            }
            id={key}
            aria-invalid={fieldState.invalid}
            {...props}
            aria-describedby={
              [
                props["aria-describedby"],
                fieldState.error ? key + "-error" : undefined,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
          />
          {fieldState.invalid && (
            <FieldError id={key + "-error"} errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}
