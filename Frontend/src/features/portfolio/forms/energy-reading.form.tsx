import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { InputField } from "@/components/form/input-field"
import { SubmitButton } from "@/components/form/submit-button"
import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { useCreateEnergyReading } from "@/features/portfolio/api/create-energy-reading.api"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import { CreateEnergyReadingInput } from "@/features/portfolio/services/energy-meter.service"

const numericText = z
  .string()
  .trim()
  .min(1, "Enter usage")
  .refine(
    (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
    "Enter a number of zero or greater"
  )
const ReadingFormInput = z.object({
  date: CreateEnergyReadingInput.shape.date,
  usage: numericText,
  cost: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0),
      "Enter a cost of zero or greater"
    ),
})

export function EnergyReadingForm({ meter }: { meter: EnergyMeter }) {
  const form = useForm<z.infer<typeof ReadingFormInput>>({
    resolver: zodResolver(ReadingFormInput),
    defaultValues: { date: "", usage: "", cost: "" },
  })
  const mutation = useCreateEnergyReading()
  function submit(data: z.output<typeof ReadingFormInput>) {
    if (mutation.isPending) return
    mutation.mutate(
      CreateEnergyReadingInput.parse({
        ...data,
        usage: Number(data.usage),
        cost: data.cost === "" ? 0 : Number(data.cost),
        propertyId: meter.propertyId,
        energyMeterId: meter.meterId,
      }),
      {
        onSuccess: () => {
          form.reset()
          toast.add({ type: "success", title: "Reading recorded" })
        },
      }
    )
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
            inputMode="decimal"
            placeholder="0"
          />
          <InputField
            control={form.control}
            name="cost"
            label="Cost (optional)"
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
