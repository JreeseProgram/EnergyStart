import {
  Building,
  BuildingId,
} from "@/features/portfolio/models/building.models"
import { delay } from "@/utils/delay"
import React from "react"
import type { BuildingService } from "@/features/portfolio/services/building.service"
import { defaultBuildings } from "@/features/portfolio/testing/fixtures/building.fixtures"
const SERVER_DELAY = 300

export function useBuildingService(): BuildingService {
  const buildings = React.useRef<Map<BuildingId, Building>>(
    new Map(defaultBuildings.map((building) => [building.id, building]))
  )
  return {
    getBuildings: async ({ propertyId }) => {
      await delay(SERVER_DELAY)
      return Array.from(buildings.current.values()).filter(
        (building) => building.parentProperty.id === propertyId
      )
    },
    getBuilding: async ({ buildingId }) => {
      await delay(SERVER_DELAY)
      const building = buildings.current.get(buildingId)
      if (!building) throw new Error(`Building ${buildingId} not found`)
      return building
    },
    createBuilding: async (input) => {
      await delay(SERVER_DELAY)
      const building = Building.parse({
        id: BuildingId.parse(crypto.randomUUID()),
        createdAt: new Date().toISOString(),
        ...input,
      })
      buildings.current.set(building.id, building)
      return building
    },
    updateBuilding: async (input) => {
      await delay(SERVER_DELAY)
      const building = Building.parse(input)
      buildings.current.set(building.id, building)
      return building
    },
  }
}
