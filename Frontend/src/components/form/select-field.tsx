import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useId } from "react"
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
} from "react-hook-form"

type FormSelectProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  required?: boolean
  errorMessage?: string
  parseValue?: (
    value: string | null
  ) => FieldPathValue<TFieldValues, FieldPath<TFieldValues>> | undefined
  formatValue?: (
    value: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
  ) => string | null
  onValueChange?: (value: string | null) => void
  items: { label: string; value: string }[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  items,
  placeholder,
  disabled,
  className,
  required,
  errorMessage,
  parseValue,
  formatValue,
  onValueChange,
}: FormSelectProps<T>) {
  const id = useId()
  const key = `${id}_${name}`

  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={key}>{label}</FieldLabel>
          <Select
            name={field.name}
            value={
              formatValue ? formatValue(field.value) : (field.value ?? null)
            }
            onValueChange={(value) => {
              const next = parseValue ? parseValue(value) : value
              field.onChange(next)
              onValueChange?.(value)
            }}
            disabled={field.disabled}
            items={items}
          >
            <SelectTrigger
              id={key}
              ref={field.ref}
              onBlur={field.onBlur}
              aria-required={required}
              aria-describedby={fieldState.error ? key + "-error" : undefined}
              aria-invalid={fieldState.invalid}
              className="w-full"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && (
            <FieldError
              id={key + "-error"}
              errors={errorMessage ? undefined : [fieldState.error]}
            >
              {errorMessage}
            </FieldError>
          )}
        </Field>
      )}
    />
  )
}
