import { BuildingUse } from "@/features/portfolio/models/building-use.models"
import {
  CreateBuildingUseInput,
  UpdateBuildingUseInput,
  type BuildingUseService,
} from "@/features/portfolio/services/building-use.service"
import { delay } from "@/utils/delay"
import {
  requireProperty,
  type PortfolioTestStore,
} from "@/features/portfolio/testing/portfolio-test-store"

const SERVER_DELAY = 300

export function createBuildingUseTestService(
  store: PortfolioTestStore
): BuildingUseService {
  const { buildingUses } = store
  return {
    getBuildingUses: async ({ propertyId }) => {
      await delay(SERVER_DELAY)
      requireProperty(store, propertyId)
      return Array.from(buildingUses.values())
        .filter((use) => use.propertyId === propertyId)
        .map((use) => BuildingUse.parse(use))
    },
    getBuildingUse: async ({ buildingUseId }) => {
      await delay(SERVER_DELAY)
      const use = buildingUses.get(buildingUseId)
      if (!use) throw new Error(`Building use ${buildingUseId} not found`)
      return BuildingUse.parse(use)
    },
    createBuildingUse: async (input) => {
      await delay(SERVER_DELAY)
      const fields = CreateBuildingUseInput.parse(input)
      requireProperty(store, fields.propertyId)
      const use = BuildingUse.parse({
        ...fields,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      })
      buildingUses.set(use.id, use)
      return BuildingUse.parse(use)
    },
    updateBuildingUse: async (input) => {
      await delay(SERVER_DELAY)
      const fields = UpdateBuildingUseInput.parse(input)
      requireProperty(store, fields.propertyId)
      const existing = buildingUses.get(fields.id)
      if (!existing || existing.propertyId !== fields.propertyId)
        throw new Error(
          `Building use ${fields.id} not found in property ${fields.propertyId}`
        )
      const use = BuildingUse.parse({
        ...fields,
        createdAt: existing.createdAt,
      })
      buildingUses.set(use.id, use)
      return BuildingUse.parse(use)
    },
  }
}
