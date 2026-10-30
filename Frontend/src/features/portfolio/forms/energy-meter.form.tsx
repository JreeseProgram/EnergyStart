import z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "@/components/form/input-field"
import { SelectField } from "@/components/form/select-field"
import { SubmitButton } from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldError, FieldSet } from "@/components/ui/field"
import { DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { useSaveEnergyMeter } from "@/features/portfolio/api/energy-meters.api"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { CreateEnergyMeterInput } from "@/features/portfolio/services/energy-meter.service"
import {
  METER_TYPES,
  METER_UNITS,
} from "@/features/portfolio/utils/energy-meter-labels"

const MeterFormInput = CreateEnergyMeterInput.omit({ propertyId: true })

export function EnergyMeterForm({
  propertyId,
  meter,
  onClose,
}: {
  propertyId: PropertyId
  meter?: EnergyMeter
  onClose: () => void
}) {
  const form = useForm<z.infer<typeof MeterFormInput>>({
    resolver: zodResolver(MeterFormInput),
    defaultValues: {
      meterId: meter?.meterId ?? "",
      meterType: meter?.meterType,
      unitOfMeasure: meter?.unitOfMeasure,
      inUse: meter?.inUse ?? true,
      isDelivered: meter?.isDelivered ?? false,
    },
  })
  const mutation = useSaveEnergyMeter()
  const hasReadings = Boolean(meter?.readings.length)
  async function submit(data: z.infer<typeof MeterFormInput>) {
    if (mutation.isPending) return
    try {
      await mutation.mutateAsync(
        meter
          ? { ...data, propertyId, energyMeterId: meter.id }
          : { ...data, propertyId }
      )
      toast.add({
        type: "success",
        title: meter ? "Meter updated" : "Meter created",
      })
      onClose()
    } catch {
      /* Feedback is displayed from the mutation below. */
    }
  }
  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-6">
      <FieldSet disabled={form.formState.isSubmitting}>
        <InputField
          control={form.control}
          name="meterId"
          label="Meter name *"
          placeholder="e.g. Grid electricity"
          maxLength={100}
        />
        {hasReadings ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>
              Energy type:{" "}
              {
                METER_TYPES.find((item) => item.value === meter?.meterType)
                  ?.label
              }
            </p>
            <p>Reading units: {meter?.unitOfMeasure}</p>
          </div>
        ) : (
          <>
            <SelectField
              control={form.control}
              name="meterType"
              label="Energy type *"
              items={METER_TYPES}
              placeholder="Select energy type"
            />
            <SelectField
              control={form.control}
              name="unitOfMeasure"
              label="Reading units *"
              items={METER_UNITS}
              placeholder="Select units"
            />
          </>
        )}
        {hasReadings && (
          <p className="text-sm text-muted-foreground">
            Type and units are fixed because this meter has readings. Its
            existing readings will be kept.
          </p>
        )}
        {(["inUse", "isDelivered"] as const).map((name) => (
          <Controller
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                />
                {name === "inUse"
                  ? "Meter is active"
                  : "Energy is delivered (such as fuel deliveries)"}
              </label>
            )}
          />
        ))}
        {mutation.isError && (
          <FieldError role="alert">{mutation.error.message}</FieldError>
        )}
      </FieldSet>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={form.formState.isSubmitting}
          onClick={onClose}
        >
          Cancel
        </Button>
        <SubmitButton>{meter ? "Save changes" : "Add meter"}</SubmitButton>
      </DialogFooter>
    </form>
  )
}
