import { portfolioKeys } from "@/features/portfolio/api/query-keys"
import { use } from "react"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import {
  GetPortfolioPerformanceInput,
  type PortfolioPerformanceService,
} from "@/features/portfolio/services/portfolio-performance.service"
import type { QueryConfig } from "@/lib/react-query"

export const getPortfolioPerformanceQueryOptions = ({
  input,
  portfolioPerformanceService,
}: {
  input: GetPortfolioPerformanceInput
  portfolioPerformanceService: PortfolioPerformanceService
}) => {
  const parsedInput = GetPortfolioPerformanceInput.parse(input)
  const normalizedInput = {
    ...parsedInput,
    propertyIds: [...new Set(parsedInput.propertyIds)].sort(),
  }
  return queryOptions({
    queryKey: portfolioKeys.properties.performance(normalizedInput),
    queryFn: () =>
      portfolioPerformanceService.getPortfolioPerformance(normalizedInput),
  })
}

export function usePortfolioPerformance({
  input,
  queryConfig,
}: {
  input: GetPortfolioPerformanceInput
  queryConfig?: QueryConfig<typeof getPortfolioPerformanceQueryOptions>
}) {
  const { portfolioPerformanceService } = use(Services)
  return useQuery({
    ...getPortfolioPerformanceQueryOptions({
      input,
      portfolioPerformanceService,
    }),
    ...queryConfig,
  })
}
