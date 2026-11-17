import { api } from "@/lib/api-client"
import z from "zod"
import {
  BuildingUse,
  BuildingUseDetails,
  BuildingUseId,
} from "@/features/portfolio/models/building-use.models"

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
    const details = BuildingUseDetails.parse(
      CreateBuildingUseInput.parse(input)
    )

    const response = await api.post<unknown, unknown>(
      "/energy-reports/building-uses",
      details
    )

    try {
      // POST currently returns EnergyReport; read back the canonical DTO.
      const { ID } = z.object({ ID: BuildingUseId }).parse(response)
      const saved = await api.get<unknown, unknown>(
        `/energy-reports/building-uses/${encodeURIComponent(ID)}`
      )
      return BuildingUse.parse(saved)
    } catch (error) {
      throw new BuildingUseSaveRefreshError(details.propertyId, error)
    }
  }

  async updateBuildingUse(input: UpdateBuildingUseInput): Promise<BuildingUse> {
    const parsed = UpdateBuildingUseInput.parse(input)
    const { id } = parsed
    const details = BuildingUseDetails.parse(parsed)

    const response = await api.put<unknown, unknown>(
      `/energy-reports/building-uses/${encodeURIComponent(id)}`,
      details
    )

    try {
      return BuildingUse.parse(response)
    } catch (error) {
      throw new BuildingUseSaveRefreshError(details.propertyId, error)
    }
  }

  async getBuildingUse(input: GetBuildingUseInput): Promise<BuildingUse> {
    const { buildingUseId } = GetBuildingUseInput.parse(input)
    const response = await api.get<unknown, unknown>(
      `/energy-reports/building-uses/${encodeURIComponent(buildingUseId)}`
    )

    return BuildingUse.parse(response)
  }

  async getBuildingUses(input: GetBuildingUsesInput): Promise<BuildingUse[]> {
    const { propertyId } = GetBuildingUsesInput.parse(input)
    const response = await api.get<unknown, unknown>(
      "/energy-reports/building-uses"
    )

    // The backend currently exposes only an unfiltered collection endpoint.
    return BuildingUse.array()
      .parse(response)
      .filter((use) => use.propertyId === propertyId)
  }
}
