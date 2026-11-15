import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{reportTitle(report)}</DialogTitle>
          <DialogDescription>
            Results for this property and reporting period.
          </DialogDescription>
        </DialogHeader>
        <EnergyReportDetails report={report} />
      </DialogContent>
    </Dialog>
  )
}
