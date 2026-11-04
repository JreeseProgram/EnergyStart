import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { EnergyReportForm } from "@/features/portfolio/forms/energy-report.form"
import type { EnergyReport } from "@/features/portfolio/models/energy-report.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"

export function EnergyReportModal({
  propertyId,
  onClose,
  onGenerated,
}: {
  propertyId: PropertyId
  onClose: () => void
  onGenerated: (report: EnergyReport) => void
}) {
  const [pending, setPending] = useState(false)
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !pending) onClose()
      }}
    >
      <DialogContent
        className="max-h-[85vh] overflow-y-auto sm:max-w-xl"
        showCloseButton={!pending}
      >
        <DialogHeader>
          <DialogTitle>Generate new report</DialogTitle>
          <DialogDescription>
            Create a saved snapshot with clearly identified simulated results.
          </DialogDescription>
        </DialogHeader>
        <EnergyReportForm
          propertyId={propertyId}
          onCancel={onClose}
          onGenerated={onGenerated}
          onPendingChange={setPending}
        />
      </DialogContent>
    </Dialog>
  )
}
