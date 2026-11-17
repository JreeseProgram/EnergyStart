import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { InputField } from "@/components/form/input-field"
import { SubmitButton } from "@/components/form/submit-button"
import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { useCreateEnergyReading } from "@/features/portfolio/api/create-energy-reading.api"
import { CreateEnergyReadingInput } from "@/features/portfolio/services/energy-meter.service"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"

export function EnergyReadingForm({ meter }: { meter: EnergyMeter }) {
  const form = useForm({
    resolver: zodResolver(CreateEnergyReadingInput),
    defaultValues: {
      propertyId: meter.propertyId,
      energyMeterId: meter.meterId,
      date: "",
      usage: NaN,
      cost: 0,
    },
  })

  const mutation = useCreateEnergyReading()

  function submit(data: CreateEnergyReadingInput) {
    if (mutation.isPending) return
    if (meter.readings.some((reading) => reading.date === data.date)) {
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
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset()
        toast.add({ type: "success", title: "Reading recorded" })
      },
    })
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4">
      <h3 className="font-semibold">Record a reading</h3>
      <FieldSet disabled={!meter.inUse || mutation.isPending}>
        <InputField
          control={form.control}
          name="date"
          label="Month *"
          type="month"
          max={new Date().toISOString().slice(0, 7)}
        />
        <FieldGroup className="grid grid-cols-2">
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
            parseValue={(value) => Number(value)}
            inputMode="decimal"
            placeholder="0"
          />
        </FieldGroup>
        {mutation.isError && (
          <FieldError role="alert">{mutation.error.message}</FieldError>
        )}
        <SubmitButton disabled={!meter.inUse || mutation.isPending}>
          Record reading
        </SubmitButton>
      </FieldSet>
      {!meter.inUse && (
        <p className="text-sm text-muted-foreground">
          Edit this meter and make it active before recording readings.
        </p>
      )}
    </form>
  )
}
