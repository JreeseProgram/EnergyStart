import z from "zod"
import { PropertyId } from "@/features/portfolio/models/property.models"
import type { PortfolioPerformance } from "@/features/portfolio/models/portfolio-performance.models"

export const GetPortfolioPerformanceInput = z.object({
  propertyIds: z.array(PropertyId),
  asOf: z.iso.date(),
})
export type GetPortfolioPerformanceInput = z.infer<
  typeof GetPortfolioPerformanceInput
>

export interface PortfolioPerformanceService {
  getPortfolioPerformance: (
    input: GetPortfolioPerformanceInput
  ) => Promise<PortfolioPerformance>
}
