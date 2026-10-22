import { useState } from "react"
import {
  EnergyMeter,
  EnergyMeterId,
} from "@/features/portfolio/models/energy-meter.models"
import {
  CreateEnergyMeterInput,
  type EnergyMeterService,
} from "@/features/portfolio/services/energy-meter.service"
import { defaultEnergyMeters } from "@/features/portfolio/testing/fixtures/energy-meter.fixtures"
import { delay } from "@/utils/delay"
import type { PropertyService } from "../../services/property.service"

const SERVER_DELAY = 300

export function useEnergyMeterTestService(
  propertyService: PropertyService
): EnergyMeterService {
  const [energyMeters] = useState(
    () =>
      new Map(
        defaultEnergyMeters.map((meter) => [meter.id, EnergyMeter.parse(meter)])
      )
  )

  return {
    getEnergyMeter: async ({ EnergyMeterId: energyMeterId }) => {
      await delay(SERVER_DELAY)
      const meter = energyMeters.get(energyMeterId)
      if (!meter) throw new Error(`Energy meter ${energyMeterId} not found`)
      return EnergyMeter.parse(meter)
    },
    getEnergyMeters: async ({ propertyId }) => {
      await delay(SERVER_DELAY)
      return Array.from(energyMeters.values())
        .filter((meter) => meter.propertyId === propertyId)
        .map((meter) => EnergyMeter.parse(meter))
    },
    createEnergyMeter: async (input) => {
      await delay(SERVER_DELAY)
      const fields = CreateEnergyMeterInput.parse(input)
      const property = await propertyService.getProperty({
        propertyId: fields.propertyId,
      })
      if (!property) throw new Error(`Property ${fields.propertyId} not found`)
      const now = new Date().toISOString()
      const meter = EnergyMeter.parse({
        ...fields,
        id: EnergyMeterId.parse(crypto.randomUUID()),
        createdAt: now,
        date: now,
        // New mock meters have no readings; kBtu is the normalized unit.
        unitOfMeasure: "kBtu",
        meterKBtu: 0,
        rawUse: 0,
        siteEui: 0,
        sourceEui: 0,
      })
      energyMeters.set(meter.id, meter)
      return EnergyMeter.parse(meter)
    },
  }
}
