import { DeleteBuildingUseInput } from "@/features/portfolio/services/building-use.service"
import { api } from "@/lib/api-client"
import z from "zod"

import {
  BuildingUse,
  BuildingUseId,
  BuildingUseDetails,
} from "@/features/portfolio/models/building-use.models"

import {
  BuildingUseSaveRefreshError,
  CreateBuildingUseInput,
  GetBuildingUseInput,
  GetBuildingUsesInput,
  UpdateBuildingUseInput,
  type BuildingUseService,
} from "@/features/portfolio/services/building-use.service"

// Parse only at the HTTP write boundary: forms use percentages, requests use fractions.
const BuildingUseSubmissionDetails = BuildingUseDetails.transform((details) => {
  if ("percentCooled" in details) details.percentCooled /= 100
  if ("percentHeated" in details) details.percentHeated /= 100
  if ("percentColdStorage" in details) details.percentColdStorage /= 100
  return details
})

// Parse only backend responses; internal models already use 0–100 percentages.
const BuildingUseResponse = BuildingUse.transform((use) => {
  if ("percentCooled" in use)
    use.percentCooled = Number((use.percentCooled * 100).toFixed(2))
  if ("percentHeated" in use)
    use.percentHeated = Number((use.percentHeated * 100).toFixed(2))
  if ("percentColdStorage" in use)
    use.percentColdStorage = Number((use.percentColdStorage * 100).toFixed(2))
  return use
})

export class BuildingUseApiService implements BuildingUseService {
  async deleteBuildingUse(input: DeleteBuildingUseInput): Promise<void> {
    const { buildingUseId } = DeleteBuildingUseInput.parse(input)
    // Building uses are EnergyReport records; this route enforces property access.
    await api.delete(`/energy-reports/${encodeURIComponent(buildingUseId)}`)
  }

  async createBuildingUse(input: CreateBuildingUseInput): Promise<BuildingUse> {
    const details = BuildingUseSubmissionDetails.parse(
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
      return BuildingUseResponse.parse(saved)
    } catch (error) {
      throw new BuildingUseSaveRefreshError(details.propertyId, error)
    }
  }

  async updateBuildingUse(input: UpdateBuildingUseInput): Promise<BuildingUse> {
    const parsed = UpdateBuildingUseInput.parse(input)
    const { id } = parsed
    const details = BuildingUseSubmissionDetails.parse(parsed)

    const response = await api.put<unknown, unknown>(
      `/energy-reports/building-uses/${encodeURIComponent(id)}`,
      details
    )

    try {
      return BuildingUseResponse.parse(response)
    } catch (error) {
      throw new BuildingUseSaveRefreshError(details.propertyId, error)
    }
  }

  async getBuildingUse(input: GetBuildingUseInput): Promise<BuildingUse> {
    const { buildingUseId } = GetBuildingUseInput.parse(input)
    const response = await api.get<unknown, unknown>(
      `/energy-reports/building-uses/${encodeURIComponent(buildingUseId)}`
    )

    return BuildingUseResponse.parse(response)
  }

  async getBuildingUses(input: GetBuildingUsesInput): Promise<BuildingUse[]> {
    const { propertyId } = GetBuildingUsesInput.parse(input)
    const response = await api.get<unknown, unknown>(
      "/energy-reports/building-uses"
    )

    // The backend currently exposes only an unfiltered collection endpoint.
    return BuildingUseResponse.array()
      .parse(response)
      .filter((use) => use.propertyId === propertyId)
  }
}
