import { PropertyType, type Building } from "@/models/building.models"
import { UserId } from "@/models/user.models"
import z from "zod"

export interface BuildingService {
  createBuilding: (input: CreateBuildingInput) => Promise<Building>
  getBuildings: (input: GetBuildingsIput) => Promise<Building[]>
}

export type CreateBuildingInput = z.infer<typeof CreateBuildingInput>
export const CreateBuildingInput = z.object({
  userId: UserId,
  propertyType: PropertyType,
  buildigSize: z.number,
  propertyAddress: z.string,
  occupancy: z.number,
  energyUsage: z.number,
})

export type GetBuildingsIput = z.infer<typeof GetBuildingsInput>
export const GetBuildingsInput = z.object({
  userId: UserId,
})
