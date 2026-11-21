import type { GetPortfolioPerformanceInput } from "@/features/portfolio/services/portfolio-performance.service"

export const portfolioKeys = {
  properties: {
    all: ["Properties"] as const,
    lists: ["Properties", "List"] as const,
    list: (page?: number) =>
      page
        ? (["Properties", "List", { page }] as const)
        : (["Properties", "List"] as const),
    detail: (propertyId: string) => ["Properties", { propertyId }] as const,
    users: (propertyId: string) =>
      ["Properties", { propertyId }, "Users"] as const,
    performances: ["Properties", "PortfolioPerformance"] as const,
    performance: (input: GetPortfolioPerformanceInput) =>
      ["Properties", "PortfolioPerformance", input] as const,
  },
  meters: {
    list: (propertyId: string) => ["EnergyMeters", propertyId] as const,
    detail: (propertyId: string, energyMeterId: string) =>
      ["EnergyMeters", propertyId, energyMeterId] as const,
  },
  buildingUses: (propertyId: string) =>
    ["BuildingUses", { propertyId }] as const,
  reports: (propertyId: string) => ["EnergyReports", propertyId] as const,
}
