import z from "zod"
import {
  Building,
  BuildingId,
} from "@/features/portfolio/models/building.models"
import { PropertyId } from "@/features/portfolio/models/property.models"
import { UserId } from "@/features/portfolio/models/user.models"

export interface BuildingService {
  getBuilding: (input: GetBuildingInput) => Promise<Building>
  getBuildings: (input: GetBuildingsInput) => Promise<Building[]>
  createBuilding: (input: CreateBuildingInput) => Promise<Building>
  updateBuilding: (input: UpdateBuildingInput) => Promise<Building>
}

export type GetBuildingInput = z.infer<typeof GetBuildingInput>
export const GetBuildingInput = z.object({ buildingId: BuildingId })

export type GetBuildingsInput = z.infer<typeof GetBuildingsInput>
export const GetBuildingsInput = z.object({ propertyId: PropertyId })

export type CreateBuildingInput = z.infer<typeof CreateBuildingInput>
export const CreateBuildingInput = Building.omit({
  id: true,
  createdAt: true,
  parentProperty: true,
  owner: true,
  auditComplianceStatus: true,
  reportingYear: true,
}).and(z.object({ propertyId: PropertyId, userId: UserId }))

export type UpdateBuildingInput = z.infer<typeof UpdateBuildingInput>
export const UpdateBuildingInput = Building.omit({
  createdAt: true,
  parentProperty: true,
  owner: true,
  auditComplianceStatus: true,
  reportingYear: true,
}).and(z.object({ propertyId: PropertyId, userId: UserId }))
