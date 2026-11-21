import { EnergyReportPeriod } from "@/features/portfolio/services/energy-report.service"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MonthYearField } from "@/components/form/month-year-field"
import { SubmitButton } from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { CredenzaFooter } from "@/components/ui/credenza"
import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"
import { useGenerateEnergyReport } from "@/features/portfolio/api/generate-energy-report.api"
import { type EnergyReport } from "@/features/portfolio/models/energy-report.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { defaultReportPeriod } from "@/features/portfolio/utils/energy-report-labels"

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

  const form = useForm<EnergyReportPeriod>({
    resolver: zodResolver(EnergyReportPeriod),
    defaultValues: period,
  })

  const mutation = useGenerateEnergyReport()

  useEffect(() => {
    onPendingChange(mutation.isPending)
  }, [mutation.isPending, onPendingChange])

  function submit(fields: EnergyReportPeriod) {
    if (mutation.isPending) return
    mutation.mutate(
      { ...fields, propertyId },
      {
        onSuccess: (report) => {
          toast.add({ type: "success", title: "Report generated" })
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
        <FieldGroup className="grid grid-cols-1">
          <MonthYearField
            control={form.control}
            name="startMonth"
            label="Start period"
            disabled={mutation.isPending}
          />

          <MonthYearField
            control={form.control}
            name="endMonth"
            label="End period"
            disabled={mutation.isPending}
          />
        </FieldGroup>
        <p className="text-sm text-muted-foreground">
          The report includes site EUI, source EUI, and an energy score with any
          qualification details.
        </p>
        {mutation.isError && (
          <FieldError role="alert">{mutation.error.message}</FieldError>
        )}
      </FieldSet>
      <CredenzaFooter>
        <Button
          type="button"
          variant="outline"
          disabled={mutation.isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <SubmitButton disabled={mutation.isPending}>
          Generate report
        </SubmitButton>
      </CredenzaFooter>
    </form>
  )
}
