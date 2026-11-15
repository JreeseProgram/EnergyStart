import { useState } from "react"
import { Plus } from "lucide-react"
import { ContentHeader } from "@/components/layouts/content-header"
import { Button } from "@/components/ui/button"
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
    (report) => report.PropertyId === property.id
  )

  return (
    <>
      <ContentHeader
        title="Property reports"
        description="Reports generated during this session"
        action={
          <Button onClick={() => setGenerating(true)}>
            Generate new report <Plus className="size-4" />
          </Button>
        }
      />

      <EnergyReportsTable reports={scopedReports} onOpen={setSelected} />

      <p className="text-xs text-muted-foreground">
        Reports stay available during navigation and are cleared on refresh.
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
