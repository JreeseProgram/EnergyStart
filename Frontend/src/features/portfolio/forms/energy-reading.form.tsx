import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { InputField } from "@/components/form/input-field"
import { SubmitButton } from "@/components/form/submit-button"
import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { useCreateEnergyReading } from "@/features/portfolio/api/energy-meters.api"
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
const ReadingFormInput = z
  .object({
    startDate: z.iso.date("Enter a start date"),
    endDate: z.iso.date("Enter an end date"),
    usage: numericText,
    cost: z
      .string()
      .trim()
      .refine(
        (value) =>
          value === "" ||
          (Number.isFinite(Number(value)) && Number(value) >= 0),
        "Enter a cost of zero or greater"
      ),
  })
  .refine((value) => value.startDate <= value.endDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  })
  .refine((value) => value.endDate <= new Date().toISOString().slice(0, 10), {
    message: "Readings cannot end in the future",
    path: ["endDate"],
  })

export function EnergyReadingForm({ meter }: { meter: EnergyMeter }) {
  const form = useForm<z.infer<typeof ReadingFormInput>>({
    resolver: zodResolver(ReadingFormInput),
    defaultValues: { startDate: "", endDate: "", usage: "", cost: "" },
  })
  const mutation = useCreateEnergyReading()
  async function submit(data: z.output<typeof ReadingFormInput>) {
    if (mutation.isPending) return
    try {
      await mutation.mutateAsync(
        CreateEnergyReadingInput.parse({
          ...data,
          usage: Number(data.usage),
          cost: data.cost === "" ? undefined : Number(data.cost),
          propertyId: meter.propertyId,
          energyMeterId: meter.id,
        })
      )
      form.reset()
      toast.add({ type: "success", title: "Reading recorded" })
    } catch {
      /* The service error is displayed below. */
    }
  }
  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4">
      <h3 className="font-semibold">Record a reading</h3>
      <FieldSet disabled={!meter.inUse || form.formState.isSubmitting}>
        <FieldGroup className="grid grid-cols-2">
          <InputField
            control={form.control}
            name="startDate"
            label="Period start *"
            type="date"
          />
          <InputField
            control={form.control}
            name="endDate"
            label="Period end *"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
          />
        </FieldGroup>
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
        <SubmitButton disabled={!meter.inUse || form.formState.isSubmitting}>
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
