import { useState } from "react"
import z from "zod"
import { defaultProperties } from "./property.service"
import { BuildingUse } from "../../models/building-use.models"
import type { PropertyService } from "../../services/property.service"
import {
  CreateBuildingUseInput,
  UpdateBuildingUseInput,
  type BuildingUseService,
} from "../../services/building-use.service"
import { delay } from "@/utils/delay"

export const defaultBuildingUses = z.array(BuildingUse).parse([
  {
    id: "b0ed477e-df48-4e5a-9c79-2323c5df5301",
    propertyId: defaultProperties[0].id,
    createdAt: "2025-01-15T12:00:00.000Z",
    buildingUseType: "OFFICE",
    grossFloorArea: 125000,
    parkingSize: 0,
    yearOfConstruction: 2000,
    numOfComputers: 100,
    numOfWorkersMainShift: 100,
    percentCooled: 100,
    weeklyOperatingHours: 40,
  },
  {
    id: "b0ed477e-df48-4e5a-9c79-2323c5df5302",
    propertyId: defaultProperties[1].id,
    createdAt: "2025-01-15T12:00:00.000Z",
    buildingUseType: "RETAIL_STORE",
    grossFloorArea: 32000,
    parkingSize: 0,
    yearOfConstruction: 2005,
    doesWorkWeekend: true,
    hasCookingFacilities: false,
    isHighSchool: false,
    numOfWorkersMainShift: 20,
    percentCooled: 100,
    percentHeated: 100,
  },
  {
    id: "b0ed477e-df48-4e5a-9c79-2323c5df5303",
    propertyId: defaultProperties[1].id,
    createdAt: "2025-01-15T12:00:00.000Z",
    buildingUseType: "DATA_CENTER",
    grossFloorArea: 1000,
    parkingSize: 0,
    yearOfConstruction: 2005,
  },
  {
    id: "b0ed477e-df48-4e5a-9c79-2323c5df5304",
    propertyId: defaultProperties[2].id,
    createdAt: "2025-01-15T12:00:00.000Z",
    buildingUseType: "MULTIFAMILY_HOUSING",
    grossFloorArea: 98000,
    parkingSize: 0,
    yearOfConstruction: 2010,
    BuildingHeight: "MID_RISE",
    numOfBedrooms: 120,
    numOfResidentialUnits: 60,
  },
])

const SERVER_DELAY = 300

export function useBuildingUseTestService(
  propertyService: PropertyService
): BuildingUseService {
  const [buildingUses] = useState(
    () =>
      new Map(
        defaultBuildingUses.map((use) => [use.id, BuildingUse.parse(use)])
      )
  )
  return {
    getBuildingUses: async ({ propertyId }) => {
      await delay(SERVER_DELAY)
      await propertyService.getProperty({ propertyId })
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
      await propertyService.getProperty({ propertyId: fields.propertyId })
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
      await propertyService.getProperty({ propertyId: fields.propertyId })
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
