import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza"
import { EnergyReportDetails } from "@/features/portfolio/components/energy-report-details"
import { reportTitle } from "@/features/portfolio/utils/energy-report-labels"
import type { EnergyReport } from "@/features/portfolio/models/energy-report.models"

export function EnergyReportDetailsModal({
  report,
  onClose,
}: {
  report: EnergyReport
  onClose: () => void
}) {
  return (
    <Credenza
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <CredenzaContent dialogClassName="sm:max-w-4xl">
        <CredenzaHeader>
          <CredenzaTitle>{reportTitle(report)}</CredenzaTitle>
          <CredenzaDescription>
            Results for this property and reporting period.
          </CredenzaDescription>
        </CredenzaHeader>
        <EnergyReportDetails report={report} />
      </CredenzaContent>
    </Credenza>
  )
}
