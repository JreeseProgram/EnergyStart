import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEnergyReport } from "@/features/portfolio/api/get-energy-report.api"
import { EnergyReportDetails } from "@/features/portfolio/components/energy-report-details"
import type { GetEnergyReportInput } from "@/features/portfolio/services/energy-report.service"
import { createCell } from "@/lib/react-query"

export function EnergyReportDetailsCell(input: GetEnergyReportInput) {
  const query = useEnergyReport(input)
  return createCell(query, {
    Loading: () => (
      <Skeleton
        className="h-64"
        role="status"
        aria-label="Loading saved report"
      />
    ),
    Failure: ({ ctx }) => (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p>Unable to load this report.</p>
        <Button variant="outline" onClick={() => void ctx.refetch()}>
          Retry
        </Button>
      </div>
    ),
    Success: ({ data }) => <EnergyReportDetails report={data} />,
  })
}
