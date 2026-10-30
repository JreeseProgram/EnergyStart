import { useState } from "react"
import {
  EnergyMeter,
  EnergyMeterId,
} from "@/features/portfolio/models/energy-meter.models"
import {
  CreateEnergyMeterInput,
  UpdateEnergyMeterInput,
  CreateEnergyReadingInput,
  GetEnergyMeterInput,
  GetEnergyMetersInput,
  type EnergyMeterService,
} from "@/features/portfolio/services/energy-meter.service"
import { defaultEnergyMeters } from "@/features/portfolio/testing/fixtures/energy-meter.fixtures"
import { delay } from "@/utils/delay"
import type { PropertyService } from "@/features/portfolio/services/property.service"

export function createEnergyMeterMockService(
  propertyService: PropertyService
): EnergyMeterService {
  const meters = new Map(
    defaultEnergyMeters.map((meter) => [meter.id, EnergyMeter.parse(meter)])
  )
  async function requireProperty(
    propertyId: GetEnergyMetersInput["propertyId"]
  ) {
    const property = await propertyService.getProperty({ propertyId })
    if (!property) throw new Error("Property not found.")
  }
  async function requireMeter(input: GetEnergyMeterInput) {
    await requireProperty(input.propertyId)
    const meter = meters.get(input.energyMeterId)
    if (!meter || meter.propertyId !== input.propertyId)
      throw new Error("Meter not found for this property.")
    return meter
  }
  function checkName(fields: CreateEnergyMeterInput, exceptId?: EnergyMeterId) {
    if (
      [...meters.values()].some(
        (meter) =>
          meter.propertyId === fields.propertyId &&
          meter.id !== exceptId &&
          meter.meterId?.toLowerCase() === fields.meterId.toLowerCase()
      )
    )
      throw new Error("A meter with this name already exists in this property.")
  }
  return {
    getEnergyMeter: async (input) => {
      await delay(300)
      return EnergyMeter.parse(
        await requireMeter(GetEnergyMeterInput.parse(input))
      )
    },
    getEnergyMeters: async (input) => {
      await delay(300)
      const { propertyId } = GetEnergyMetersInput.parse(input)
      await requireProperty(propertyId)
      return [...meters.values()]
        .filter((meter) => meter.propertyId === propertyId)
        .map((meter) => EnergyMeter.parse(meter))
    },
    createEnergyMeter: async (input) => {
      await delay(300)
      const fields = CreateEnergyMeterInput.parse(input)
      await requireProperty(fields.propertyId)
      checkName(fields)
      const now = new Date().toISOString()
      const meter = EnergyMeter.parse({
        ...fields,
        id: crypto.randomUUID(),
        createdAt: now,
        date: now,
        updatedAt: now,
        readings: [],
        meterKBtu: 0,
        rawUse: 0,
        siteEui: 0,
        sourceEui: 0,
      })
      meters.set(meter.id, meter)
      return EnergyMeter.parse(meter)
    },
    updateEnergyMeter: async (input) => {
      await delay(300)
      const { energyMeterId, ...fields } = UpdateEnergyMeterInput.parse(input)
      const current = await requireMeter({ ...fields, energyMeterId })
      checkName(fields, energyMeterId)
      if (
        current.readings.length &&
        (fields.unitOfMeasure !== current.unitOfMeasure ||
          fields.meterType !== current.meterType)
      )
        throw new Error(
          "Type and units cannot change after readings have been recorded."
        )
      const updated = EnergyMeter.parse({
        ...current,
        ...fields,
        updatedAt: new Date().toISOString(),
      })
      meters.set(updated.id, updated)
      return EnergyMeter.parse(updated)
    },
    createEnergyReading: async (input) => {
      await delay(300)
      const { propertyId, energyMeterId, ...fields } =
        CreateEnergyReadingInput.parse(input)
      const current = await requireMeter({ propertyId, energyMeterId })
      if (!current.inUse)
        throw new Error("Activate this meter before adding readings.")
      if (
        current.readings.some(
          (reading) =>
            fields.startDate <= reading.endDate &&
            fields.endDate >= reading.startDate
        )
      )
        throw new Error(
          "This period overlaps an existing reading. Choose a different period."
        )
      const now = new Date().toISOString()
      const reading = { ...fields, id: crypto.randomUUID(), createdAt: now }
      const updated = EnergyMeter.parse({
        ...current,
        readings: [...current.readings, reading],
        updatedAt: now,
      })
      meters.set(updated.id, updated)
      return EnergyMeter.parse(updated)
    },
  }
}

export function useEnergyMeterTestService(
  propertyService: PropertyService
): EnergyMeterService {
  const [service] = useState(() =>
    createEnergyMeterMockService(propertyService)
  )
  return service
}
