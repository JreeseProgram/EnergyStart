import { usePortfolioPerformance } from "@/features/portfolio/api/get-portfolio-performance.api"
import type { Property } from "@/features/portfolio/models/property.models"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProperties } from "@/features/portfolio/api/get-properties.api"
import { PortfolioDashboard } from "@/features/portfolio/components/portfolio-dashboard"
import { PropertiesListEmpty } from "@/features/portfolio/components/properties-list"
import { PropertyModal } from "@/features/portfolio/modals/property.modal"
import { createCell } from "@/lib/react-query"

export function PortfolioDashboardCell() {
  const query = useProperties({})
  return createCell(query, {
    Loading: () => (
      <div
        role="status"
        aria-label="Loading portfolio dashboard"
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-48 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    ),
    Failure: ({ ctx }) => (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p>Unable to load your portfolio. Please try again.</p>
        <Button variant="outline" onClick={() => void ctx.refetch()}>
          Retry
        </Button>
      </div>
    ),
    Empty: () => (
      <PropertiesListEmpty>
        <PropertyModal render={<Button />}>Add property</PropertyModal>
      </PropertiesListEmpty>
    ),
    isEmpty: ({ data }) => data.length === 0,
    Success: ({ data }) => (
      <PortfolioPerformanceCell
        key={data
          .map((property) => property.id)
          .sort()
          .join(",")}
        properties={data}
      />
    ),
  })
}

function PortfolioPerformanceCell({ properties }: { properties: Property[] }) {
  const query = usePortfolioPerformance({
    input: {
      propertyIds: properties.map((property) => property.id),
      asOf: new Date().toISOString().slice(0, 10),
    },
  })
  return createCell(query, {
    Loading: () => (
      <div role="status" aria-label="Loading portfolio performance">
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    ),
    Failure: ({ ctx }) => (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p>Unable to load portfolio performance. Please try again.</p>
        <Button variant="outline" onClick={() => void ctx.refetch()}>
          Retry
        </Button>
      </div>
    ),
    Success: ({ data }) => (
      <PortfolioDashboard properties={properties} performance={data} />
    ),
  })
}
