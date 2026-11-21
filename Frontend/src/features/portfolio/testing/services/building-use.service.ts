import {
  BuildingUse,
  type BuildingUseDetails,
} from "@/features/portfolio/models/building-use.models"
import { delay } from "@/utils/delay"

import {
  DeleteBuildingUseInput,
  CreateBuildingUseInput,
  UpdateBuildingUseInput,
  type BuildingUseService,
} from "@/features/portfolio/services/building-use.service"

import {
  requireProperty,
  type PortfolioTestStore,
} from "@/features/portfolio/testing/portfolio-test-store"

const SERVER_DELAY = 300

// Match the backend mapper's normalization of omitted rise-unit counts.
function normalizeRiseUnits(fields: BuildingUseDetails): BuildingUseDetails {
  return fields.buildingUseType === "MULTIFAMILY_HOUSING"
    ? {
        ...fields,
        lowRiseUnits: fields.lowRiseUnits ?? 0,
        midRiseUnits: fields.midRiseUnits ?? 0,
        highRiseUnits: fields.highRiseUnits ?? 0,
      }
    : fields
}

export function createBuildingUseTestService(
  store: PortfolioTestStore
): BuildingUseService {
  const { buildingUses } = store
  return {
    deleteBuildingUse: async (input) => {
      const { propertyId, buildingUseId } = DeleteBuildingUseInput.parse(input)
      requireProperty(store, propertyId)
      const use = buildingUses.get(buildingUseId)
      if (!use || use.propertyId !== propertyId) throw new Error("Building use not found.")
      buildingUses.delete(buildingUseId)
    },
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

      if (!use) {
        throw new Error(`Building use ${buildingUseId} not found`)
      }

      return BuildingUse.parse(use)
    },

    createBuildingUse: async (input) => {
      await delay(SERVER_DELAY)

      const fields = CreateBuildingUseInput.parse(input)

      requireProperty(store, fields.propertyId)

      const use = BuildingUse.parse({
        ...normalizeRiseUnits(fields),
        id: crypto.randomUUID(),
        createdAt: null,
      })

      buildingUses.set(use.id, use)

      return BuildingUse.parse(use)
    },
    updateBuildingUse: async (input) => {
      await delay(SERVER_DELAY)

      const fields = UpdateBuildingUseInput.parse(input)

      requireProperty(store, fields.propertyId)

      const existing = buildingUses.get(fields.id)

      if (!existing || existing.propertyId !== fields.propertyId) {
        throw new Error(
          `Building use ${fields.id} not found in property ${fields.propertyId}`
        )
      }

      const use = BuildingUse.parse({
        ...normalizeRiseUnits(fields),
        id: fields.id,
        createdAt: existing.createdAt,
      })

      buildingUses.set(use.id, use)

      return BuildingUse.parse(use)
    },
  }
}
