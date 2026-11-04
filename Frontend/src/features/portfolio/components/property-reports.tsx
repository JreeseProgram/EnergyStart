import { useState } from "react"
import { Plus } from "lucide-react"
import { ContentHeader } from "@/components/layouts/content-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/features/portfolio/models/property.models"
import type { EnergyReport } from "@/features/portfolio/models/energy-report.models"
import { EnergyReportsTable } from "@/features/portfolio/components/energy-reports-table"
import { EnergyReportModal } from "@/features/portfolio/modals/energy-report.modal"
import { EnergyReportDetailsModal } from "@/features/portfolio/modals/energy-report-details.modal"

export function PropertyReports({
  property,
  reports,
}: {
  property: Property
  reports: EnergyReport[]
}) {
  const [generating, setGenerating] = useState(false)
  const [selected, setSelected] = useState<EnergyReport | null>(null)
  const scopedReports = reports.filter(
    (report) => report.propertyId === property.id
  )
  return (
    <>
      <ContentHeader
        title="Property reports"
        description="Saved results and calculations for this property"
        action={
          <Button onClick={() => setGenerating(true)}>
            Generate new report <Plus className="size-4" />
          </Button>
        }
      />
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="outline">Simulated results</Badge>Reports use prototype
        history, not meter readings or official calculations.
      </p>
      <EnergyReportsTable reports={scopedReports} onOpen={setSelected} />
      <p className="text-xs text-muted-foreground">
        Reports stay available during navigation and may reset on refresh.
      </p>
      {generating && (
        <EnergyReportModal
          propertyId={property.id}
          onClose={() => setGenerating(false)}
          onGenerated={(report) => {
            setGenerating(false)
            setSelected(report)
          }}
        />
      )}
      {selected && (
        <EnergyReportDetailsModal
          report={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
