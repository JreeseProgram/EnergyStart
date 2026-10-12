import { testUser } from "@/features/auth/testing/services/auth.service"
import {
  Building,
  BuildingId,
} from "@/features/portfolio/models/building.models"
import { delay } from "@/utils/delay"
import React from "react"
import z from "zod"
import type { BuildingService } from "@/features/portfolio/services/building.service"
import { Property } from "@/features/portfolio/models/property.models"
import { defaultProperties } from "@/features/portfolio/testing/services/property.service"

const parentProperties = z
  .array(Property)
  .parse(
    defaultProperties.map((property) => ({ ...property, owner: testUser }))
  )

export const defaultBuildings = z.array(Building).parse([
  {
    id: "b0ed477e-df48-4e5a-9c79-2323c5df5301",
    createdAt: "2025-01-15T12:00:00.000Z",
    humanReadableBuildingId: "BLDG-001",
    name: "Lake Eola Office Tower",
    notes: "LED lighting retrofit completed in 2025.",
    owner: testUser,
    parentProperty: parentProperties[0],
    grossFloorArea: 125000,
    energyUse: 6875000,
    siteEui: 55,
    sourceEui: 121,
    annualGHG: 420,
    energyStarScore: 86,
    auditComplianceStatus: "PARTICIPATING",
    reportingYear: "2025",
  },

  {
    id: "b0ed477e-df48-4e5a-9c79-2323c5df5302",
    createdAt: "2025-02-10T12:00:00.000Z",
    humanReadableBuildingId: "BLDG-002",
    name: "Mills 50 Retail Center",
    notes: "HVAC efficiency improvements planned.",
    owner: testUser,
    parentProperty: parentProperties[1],
    grossFloorArea: 32000,
    energyUse: 2720000,
    siteEui: 85,
    sourceEui: 187,
    annualGHG: 180,
    energyStarScore: 50,
    auditComplianceStatus: "NOT_PARTICIPATING",
    reportingYear: "2025",
  },

  {
    id: "b0ed477e-df48-4e5a-9c79-2323c5df5303",
    createdAt: "2025-03-20T12:00:00.000Z",
    humanReadableBuildingId: "BLDG-003",
    name: "Sunrail Commons Apartments",
    notes: "High-efficiency heat pumps installed throughout the building.",
    owner: testUser,
    parentProperty: parentProperties[2],
    grossFloorArea: 98000,
    energyUse: 3920000,
    siteEui: 40,
    sourceEui: 88,
    annualGHG: 240,
    energyStarScore: 91,
    auditComplianceStatus: "APPROVED_FOR_EXEMPTION",
    reportingYear: "2025",
  },

  {
    id: "b0ed477e-df48-4e5a-9c79-2323c5df5304",
    createdAt: "2025-04-05T12:00:00.000Z",
    humanReadableBuildingId: "BLDG-004",
    name: "Cypress Distribution Warehouse",
    notes: "Energy audit scheduled to assess aging equipment.",
    owner: testUser,
    parentProperty: parentProperties[3],
    grossFloorArea: 210000,
    energyUse: 18900000,
    siteEui: 90,
    sourceEui: 198,
    annualGHG: 1250,
    energyStarScore: 24,
    auditComplianceStatus: "NOT_PARTICIPATING",
    reportingYear: "2025",
  },
])

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
