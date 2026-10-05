import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useId } from "react"
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

type FormInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
} & Omit<
  React.ComponentProps<"input">,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref"
>

export function InputField<T extends FieldValues>({
  control,
  name,
  label,
  className,
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
            id={key}
            aria-invalid={fieldState.invalid}
            {...props}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
