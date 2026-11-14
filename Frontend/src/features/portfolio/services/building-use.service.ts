import z from "zod"
import { PropertyId } from "@/features/portfolio/models/property.models"
import { UserId } from "@/features/portfolio/models/user.models"
import {
  BuildingUse,
  BuildingUseId,
  BuildingUseFormDetails,
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
export const CreateBuildingUseInput = BuildingUseFormDetails.and(
  z.object({ userId: UserId })
)

export type UpdateBuildingUseInput = z.infer<typeof UpdateBuildingUseInput>
export const UpdateBuildingUseInput = BuildingUseFormDetails.and(
  z.object({ id: BuildingUseId, userId: UserId })
)

// The write succeeded; an unreadable response must not invite another write.
export class BuildingUseSaveRefreshError extends Error {
  readonly propertyId: PropertyId

  constructor(propertyId: PropertyId, cause: unknown) {
    super(
      "Building use saved, but its details could not be loaded. Close this form and reload the building-use list; do not submit it again.",
      { cause }
    )
    this.name = "BuildingUseSaveRefreshError"
    this.propertyId = propertyId
  }
}
