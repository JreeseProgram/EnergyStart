import { api } from "@/lib/api-client"
import { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import {
  CreateEnergyMeterInput,
  EnergyMeterCreateRefreshError,
  EnergyMeterUpdateRefreshError,
  GetEnergyMeterInput,
  GetEnergyMetersInput,
  UpdateEnergyMeterInput,
  type EnergyMeterService,
} from "@/features/portfolio/services/energy-meter.service"

export class EnergyMeterApiService implements Pick<
  EnergyMeterService,
  | "getEnergyMeter"
  | "getEnergyMeters"
  | "createEnergyMeter"
  | "updateEnergyMeter"
> {
  async createEnergyMeter(input: CreateEnergyMeterInput): Promise<EnergyMeter> {
    const fields = CreateEnergyMeterInput.parse(input)
    const response = await api.post<unknown, unknown>(
      "/energy-meters/dto",
      fields
    )

    try {
      const meter = EnergyMeter.parse(response)
      if (meter.propertyId !== fields.propertyId) {
        throw new Error("Meter not found for this property.")
      }
      return meter
    } catch (error) {
      throw new EnergyMeterCreateRefreshError(fields.propertyId, error)
    }
  }

  async updateEnergyMeter(input: UpdateEnergyMeterInput): Promise<EnergyMeter> {
    const { energyMeterId, ...fields } = UpdateEnergyMeterInput.parse(input)
    const response = await api.put<unknown, unknown>(
      `/energy-meters/dto/${encodeURIComponent(energyMeterId)}`,
      fields
    )

    try {
      const meter = EnergyMeter.parse(response)
      if (
        meter.meterId !== energyMeterId ||
        meter.propertyId !== fields.propertyId
      ) {
        throw new Error("Meter not found for this property.")
      }
      return meter
    } catch (error) {
      throw new EnergyMeterUpdateRefreshError(fields.propertyId, error)
    }
  }

  async getEnergyMeters(input: GetEnergyMetersInput): Promise<EnergyMeter[]> {
    const { propertyId } = GetEnergyMetersInput.parse(input)
    const response = await api.get<unknown, unknown>(
      `/energy-meters/dto/asList/${encodeURIComponent(propertyId)}`
    )
    const meters = EnergyMeter.array().parse(response)
    if (meters.some((meter) => meter.propertyId !== propertyId)) {
      throw new Error("Meter not found for this property.")
    }
    return meters
  }

  async getEnergyMeter(input: GetEnergyMeterInput): Promise<EnergyMeter> {
    const { energyMeterId, propertyId } = GetEnergyMeterInput.parse(input)
    const response = await api.get<unknown, unknown>(
      `/energy-meters/dto/${encodeURIComponent(energyMeterId)}`
    )
    const meter = EnergyMeter.parse(response)
    if (meter.meterId !== energyMeterId || meter.propertyId !== propertyId) {
      throw new Error("Meter not found for this property.")
    }
    return meter
  }
}
