import type { PortfolioTestStore } from "@/features/portfolio/testing/portfolio-test-store"
import { defaultEnergyMeters } from "@/features/portfolio/testing/fixtures/energy-meter.fixtures"
import { delay } from "@/utils/delay"
import type { PropertyService } from "@/features/portfolio/services/property.service"
import { useState } from "react"

import {
  EnergyMeter,
  EnergyMeterId,
} from "@/features/portfolio/models/energy-meter.models"

import {
  DeleteEnergyMeterInput,
  DeleteEnergyReadingInput,
  CreateEnergyMeterInput,
  UpdateEnergyMeterInput,
  CreateEnergyReadingInput,
  GetEnergyMeterInput,
  GetEnergyMetersInput,
  type EnergyMeterService,
} from "@/features/portfolio/services/energy-meter.service"

export function createEnergyMeterMockService(
  propertyService: PropertyService,
  store?: PortfolioTestStore
): EnergyMeterService {
  const meters = new Map(
    defaultEnergyMeters.map((meter) => [
      meter.meterId,
      EnergyMeter.parse(meter),
    ])
  )
  store?.onPropertyDeleted.add((propertyId) => {
    for (const [id, meter] of meters) {
      if (meter.propertyId === propertyId) meters.delete(id)
    }
  })
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
          meter.meterId !== exceptId &&
          meter.meterName?.toLowerCase() === fields.meterName.toLowerCase()
      )
    )
      throw new Error("A meter with this name already exists in this property.")
  }
  return {
    deleteEnergyMeter: async (input) => {
      const fields = DeleteEnergyMeterInput.parse(input)
      await requireMeter(fields)
      meters.delete(fields.energyMeterId)
    },
    deleteEnergyReading: async (input) => {
      const fields = DeleteEnergyReadingInput.parse(input)
      const meter = await requireMeter(fields)
      if (!meter.readings.some((reading) => reading.id === fields.readingId))
        throw new Error("Reading not found.")
      meters.set(
        meter.meterId,
        EnergyMeter.parse({
          ...meter,
          readings: meter.readings.filter(
            (reading) => reading.id !== fields.readingId
          ),
        })
      )
    },
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
      const meter = EnergyMeter.parse({
        ...fields,
        meterId: crypto.randomUUID(),
        readings: [],
      })
      meters.set(meter.meterId, meter)
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
      })
      meters.set(updated.meterId, updated)
      return EnergyMeter.parse(updated)
    },
    createEnergyReading: async (input) => {
      await delay(300)
      const { propertyId, energyMeterId, ...fields } =
        CreateEnergyReadingInput.parse(input)
      const current = await requireMeter({ propertyId, energyMeterId })
      if (!current.inUse)
        throw new Error("Activate this meter before adding readings.")
      if (current.readings.some((reading) => fields.date === reading.date))
        throw new Error(
          "A reading already exists for this month. Choose a different month."
        )
      const now = new Date().toISOString()
      const reading = { ...fields, id: crypto.randomUUID(), createdAt: now }
      const updated = EnergyMeter.parse({
        ...current,
        readings: [...current.readings, reading],
      })
      meters.set(updated.meterId, updated)
      return EnergyMeter.parse(updated)
    },
  }
}

export function useEnergyMeterTestService(
  propertyService: PropertyService,
  store?: PortfolioTestStore
): EnergyMeterService {
  const [service] = useState(() =>
    createEnergyMeterMockService(propertyService, store)
  )
  return service
}
