import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputField } from "@/components/form/input-field"
import { SelectField } from "@/components/form/select-field"
import { SubmitButton } from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { useGenerateEnergyReport } from "@/features/portfolio/api/generate-energy-report.api"
import {
  EnergyReportFields,
  type EnergyReport,
} from "@/features/portfolio/models/energy-report.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import {
  REPORT_TYPES,
  defaultReportPeriod,
} from "@/features/portfolio/utils/energy-report-labels"

export function EnergyReportForm({
  propertyId,
  onGenerated,
  onCancel,
  onPendingChange,
}: {
  propertyId: PropertyId
  onGenerated: (report: EnergyReport) => void
  onCancel: () => void
  onPendingChange: (pending: boolean) => void
}) {
  const period = defaultReportPeriod()
  const form = useForm<EnergyReportFields>({
    resolver: zodResolver(EnergyReportFields),
    defaultValues: { name: "", reportType: "SITE_EUI", ...period },
  })
  const mutation = useGenerateEnergyReport()
  useEffect(() => {
    onPendingChange(mutation.isPending)
  }, [mutation.isPending, onPendingChange])

  function submit(fields: EnergyReportFields) {
    if (mutation.isPending) return
    mutation.mutate(
      { ...fields, propertyId },
      {
        onSuccess: (report) => {
          toast.add({ type: "success", title: "Simulated report generated" })
          onGenerated(report)
        },
      }
    )
  }
  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <FieldSet disabled={mutation.isPending}>
        <InputField
          control={form.control}
          name="name"
          label="Report name *"
          placeholder="e.g. Annual Site EUI"
          maxLength={100}
        />
        <SelectField
          control={form.control}
          name="reportType"
          label="Report type *"
          items={REPORT_TYPES}
          placeholder="Select report type"
        />
        <FieldGroup className="grid grid-cols-2">
          <InputField
            control={form.control}
            name="startMonth"
            label="Start month *"
            type="month"
            max={period.endMonth}
          />
          <InputField
            control={form.control}
            name="endMonth"
            label="End month *"
            type="month"
            max={period.endMonth}
          />
        </FieldGroup>
        <p className="text-sm text-muted-foreground">
          Choose completed months within the last 24 months. The report uses
          simulated history, not meter readings.
        </p>
        {mutation.isError && (
          <FieldError role="alert">{mutation.error.message}</FieldError>
        )}
      </FieldSet>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={mutation.isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <SubmitButton disabled={mutation.isPending}>
          Generate simulated report
        </SubmitButton>
      </DialogFooter>
    </form>
  )
}
