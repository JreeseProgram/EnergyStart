import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { MonthYearField } from "@/components/form/month-year-field"
import { InputField } from "@/components/form/input-field"
import { SubmitButton } from "@/components/form/submit-button"
import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { useCreateEnergyReading } from "@/features/portfolio/api/energy-reading/create-energy-reading.api"
import { useUpdateEnergyReading } from "@/features/portfolio/api/energy-reading/update-energy-reading.api"
import { CreateEnergyReadingInput } from "@/features/portfolio/services/energy-meter.service"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"

export function EnergyReadingForm({
  meter,
  reading,
  onSuccess,
  onCancel,
}: {
  meter: EnergyMeter
  reading?: EnergyMeter["readings"][number]
  onSuccess: () => void
  onCancel: () => void
}) {
  const canSave = Boolean(reading) || meter.inUse
  const form = useForm({
    resolver: zodResolver(CreateEnergyReadingInput),
    defaultValues: {
      propertyId: meter.propertyId,
      energyMeterId: meter.meterId,
      date: reading?.date ?? "",
      usage: reading?.usage ?? NaN,
      cost: reading?.cost ?? 0,
    },
  })

  const { setFocus } = form

  useEffect(() => {
    if (canSave) setFocus("date")
  }, [canSave, setFocus])

  const create = useCreateEnergyReading()
  const update = useUpdateEnergyReading()
  const mutation = reading ? update : create

  function submit(data: CreateEnergyReadingInput) {
    if (mutation.isPending) return

    if (
      meter.readings.some(
        (item) => item.id !== reading?.id && item.date === data.date
      )
    ) {
      form.setError(
        "date",
        {
          type: "duplicate",
          message:
            "A reading already exists for this month. Choose another month.",
        },
        { shouldFocus: true }
      )
      return
    }

    function saved() {
      form.reset()
      toast.add({
        type: "success",
        title: reading ? "Reading updated" : "Reading saved",
      })
      onSuccess()
    }

    if (reading)
      update.mutate({ ...data, readingId: reading.id }, { onSuccess: saved })
    else create.mutate(data, { onSuccess: saved })
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Enter usage for this month. Each month can have one reading.
      </p>

      <FieldSet disabled={!canSave || mutation.isPending}>
        <MonthYearField
          control={form.control}
          name="date"
          label="Month"
          hideLabel
          disabled={!canSave || mutation.isPending}
        />

        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
          <InputField
            control={form.control}
            name="usage"
            label={`Usage (${meter.unitOfMeasure}) *`}
            type="number"
            step="any"
            min={0}
            parseValue={(value) => (value.trim() === "" ? NaN : Number(value))}
            formatValue={(value) => (Number.isFinite(value) ? value : "")}
            inputMode="decimal"
            placeholder="0"
          />

          <InputField
            control={form.control}
            name="cost"
            label="Cost (optional)"
            type="number"
            step="any"
            min={0}
            parseValue={(value) => (value.trim() === "" ? NaN : Number(value))}
            inputMode="decimal"
            placeholder="0"
          />
        </FieldGroup>

        {mutation.isError && (
          <FieldError role="alert">{mutation.error.message}</FieldError>
        )}

        <SubmitButton disabled={!canSave || mutation.isPending}>
          Save reading
        </SubmitButton>
      </FieldSet>

      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={mutation.isPending}
      >
        Cancel
      </Button>

      {!canSave && (
        <p className="text-sm text-muted-foreground">
          Edit this meter and make it active before recording readings.
        </p>
      )}
    </form>
  )
}
