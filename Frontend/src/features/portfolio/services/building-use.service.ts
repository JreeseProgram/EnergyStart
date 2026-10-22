import z from "zod"
import { PropertyId } from "@/features/portfolio/models/property.models"
import { UserId } from "@/features/portfolio/models/user.models"
import {
  BuildingUse,
  BuildingUseId,
  BuildingUseDetails,
} from "@/features/portfolio/models/building-use.models"

export interface BuildingUseService {
  getBuildingUse: (input: GetBuildingUseInput) => Promise<BuildingUse>
  getBuildingUses: (input: GetBuildingUsesInput) => Promise<BuildingUse[]>
  createBuildingUse: (input: CreateBuildingUseInput) => Promise<BuildingUse>
  updateBuildingUse: (input: UpdateBuildingUseInput) => Promise<BuildingUse>
}

export type GetBuildingUseInput = z.infer<typeof GetBuildingUseInput>
export const GetBuildingUseInput = z.object({ buildingUseId: BuildingUseId })

export type GetBuildingUsesInput = z.infer<typeof GetBuildingUsesInput>
export const GetBuildingUsesInput = z.object({ propertyId: PropertyId })

export type CreateBuildingUseInput = z.infer<typeof CreateBuildingUseInput>
export const CreateBuildingUseInput = BuildingUseDetails.and(
  z.object({ userId: UserId })
)

export type UpdateBuildingUseInput = z.infer<typeof UpdateBuildingUseInput>
export const UpdateBuildingUseInput = BuildingUseDetails.and(
  z.object({ id: BuildingUseId, userId: UserId })
)
