import { api } from "@/lib/api-client"
import { BuildingUse } from "@/features/portfolio/models/building-use.models"

import {
  BuildingUseSaveRefreshError,
  CreateBuildingUseInput,
  GetBuildingUseInput,
  GetBuildingUsesInput,
  UpdateBuildingUseInput,
  type BuildingUseService,
} from "@/features/portfolio/services/building-use.service"

export class BuildingUseApiService implements BuildingUseService {
  async createBuildingUse(input: CreateBuildingUseInput): Promise<BuildingUse> {
    const details = CreateBuildingUseInput.parse(input)

    const response = await api.post<unknown, unknown>(
      "/energy-reports",
      details
    )

    try {
      return BuildingUse.parse(response)
    } catch (error) {
      throw new BuildingUseSaveRefreshError(details.relatedPropertyID, error)
    }
  }

  async updateBuildingUse(input: UpdateBuildingUseInput): Promise<BuildingUse> {
    const { id, ...details } = UpdateBuildingUseInput.parse(input)

    const response = await api.put<unknown, unknown>(
      `/energy-reports/${encodeURIComponent(id)}`,
      details
    )

    try {
      return BuildingUse.parse(response)
    } catch (error) {
      throw new BuildingUseSaveRefreshError(details.relatedPropertyID, error)
    }
  }

  async getBuildingUse(input: GetBuildingUseInput): Promise<BuildingUse> {
    const { buildingUseId } = GetBuildingUseInput.parse(input)
    const response = await api.get<unknown, unknown>(
      `/energy-reports/${encodeURIComponent(buildingUseId)}`
    )

    return BuildingUse.parse(response)
  }

  async getBuildingUses(input: GetBuildingUsesInput): Promise<BuildingUse[]> {
    const { propertyId } = GetBuildingUsesInput.parse(input)
    const response = await api.get<unknown, unknown>("/energy-reports")

    // The backend currently exposes only an unfiltered collection endpoint.
    return BuildingUse.array()
      .parse(response)
      .filter((use) => use.relatedPropertyID === propertyId)
  }
}
