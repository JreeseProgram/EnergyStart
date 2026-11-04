import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EnergyReportDetailsCell } from "@/features/portfolio/cells/energy-report-details.cell"
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
          <DialogTitle>{report.name}</DialogTitle>
          <DialogDescription>
            Simulated results for this property. This is not an official energy
            report.
          </DialogDescription>
        </DialogHeader>
        <EnergyReportDetailsCell
          propertyId={report.propertyId}
          reportId={report.id}
        />
      </DialogContent>
    </Dialog>
  )
}
