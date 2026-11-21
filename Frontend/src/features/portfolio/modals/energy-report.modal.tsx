import { useEffect, useState } from "react"
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
} from "@/components/ui/credenza"
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
  const [open, setOpen] = useState(false)

  // These modals mount on demand; start closed so Base UI runs its entrance transition.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const [generatedReport, setGeneratedReport] = useState<EnergyReport | null>(
    null
  )

  const [pending, setPending] = useState(false)

  return (
    <Credenza
      open={open}
      onOpenChange={(next, event) => {
        if (!next && pending) event.cancel()
        else setOpen(next)
      }}
      onOpenChangeComplete={(next) => {
        if (next) return
        if (generatedReport) onGenerated(generatedReport)
        else onClose()
      }}
    >
      <CredenzaContent dialogClassName="sm:max-w-xl" showCloseButton={!pending}>
        <CredenzaHeader>
          <CredenzaTitle>Generate new report</CredenzaTitle>
          <CredenzaDescription>
            Get results for a month range and keep them in this session’s
            history.
          </CredenzaDescription>
        </CredenzaHeader>
        <EnergyReportForm
          propertyId={propertyId}
          onCancel={() => setOpen(false)}
          onGenerated={(report) => {
            setGeneratedReport(report)
            setOpen(false)
          }}
          onPendingChange={setPending}
        />
      </CredenzaContent>
    </Credenza>
  )
}
