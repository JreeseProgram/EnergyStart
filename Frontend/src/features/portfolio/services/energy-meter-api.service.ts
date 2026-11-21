import {
  DeleteEnergyMeterInput,
  DeleteEnergyReadingInput,
} from "@/features/portfolio/services/energy-meter.service"
import { api } from "@/lib/api-client"

import {
  EnergyMeter,
  EnergyReading,
} from "@/features/portfolio/models/energy-meter.models"

import {
  CreateEnergyMeterInput,
  CreateEnergyReadingInput,
  EnergyReadingCreateRefreshError,
  EnergyMeterCreateRefreshError,
  EnergyMeterUpdateRefreshError,
  GetEnergyMeterInput,
  GetEnergyMetersInput,
  UpdateEnergyMeterInput,
  type EnergyMeterService,
} from "@/features/portfolio/services/energy-meter.service"

// The reading controller returns null for createdAt; canonical meters do not.
const CreatedEnergyReading = EnergyReading.extend({
  createdAt: EnergyReading.shape.createdAt.nullable(),
})

export class EnergyMeterApiService implements EnergyMeterService {
  async deleteEnergyMeter(input: DeleteEnergyMeterInput): Promise<void> {
    const { energyMeterId } = DeleteEnergyMeterInput.parse(input)
    await api.delete(`/energy-meters/dto/${encodeURIComponent(energyMeterId)}`)
  }

  async deleteEnergyReading(input: DeleteEnergyReadingInput): Promise<void> {
    const { readingId } = DeleteEnergyReadingInput.parse(input)
    await api.delete(`/energy-meter-readings/${encodeURIComponent(readingId)}`)
  }

  async createEnergyReading(
    input: CreateEnergyReadingInput
  ): Promise<EnergyMeter> {
    const { energyMeterId, propertyId, date, usage, cost } =
      CreateEnergyReadingInput.parse(input)

    const response = await api.post<unknown, unknown>(
      `/energy-meter-readings/meter/${encodeURIComponent(energyMeterId)}`,
      { date, usage, cost }
    )

    try {
      CreatedEnergyReading.parse(response)

      const saved = await api.get<unknown, unknown>(
        `/energy-meters/dto/${encodeURIComponent(energyMeterId)}`
      )

      const meter = EnergyMeter.parse(saved)

      if (meter.meterId !== energyMeterId || meter.propertyId !== propertyId) {
        throw new Error("Meter not found for this property.")
      }

      return meter
    } catch (error) {
      throw new EnergyReadingCreateRefreshError(
        propertyId,
        energyMeterId,
        error
      )
    }
  }

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
