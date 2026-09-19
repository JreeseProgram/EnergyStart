import {
  Building,
  BuildingId,
} from "@/features/portfolio/models/building.models"
import { User } from "@/features/auth/models/user.models"
import {
  CreateBuildingInput,
  type BuildingService,
  type GetBuildingsIput,
} from "@/features/portfolio/services/building.service"

export class BuildingInMemoryService implements BuildingService {
  private buildings = new Map<BuildingId, Building>()

  async createBuilding(input: CreateBuildingInput) {
    const parsedInput = CreateBuildingInput.parse(input)
    const user = User.parse({
      id: parsedInput.userId,
      email: "test@test.com",
      firstName: "TEST",
      lastName: "TEST",
      role: "ADMIN",
    })
    const building = Building.parse({
      complianceStatus: "NOT_PARTICIPATING",
      buildingSize: parsedInput.buildigSize,
      owner: user,
      propertyAddress: parsedInput.propertyAddress,
      propertyUseType: parsedInput.propertyType,
    })
    this.buildings.set(building.id, building)
    return building
  }

  async getBuildings(input: GetBuildingsIput) {
    return Array.from(this.buildings.values()).filter(
      (building) => building.owner.id === input.userId
    )
  }
}
