import {
  EnergyMeter,
  EnergyMeterId,
} from "@/features/portfolio/models/energy-meter.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import {
  CreateEnergyMeterInput,
  type EnergyMeterService,
} from "@/features/portfolio/services/energy-meter.service"
import { defaultEnergyMeters } from "@/features/portfolio/testing/fixtures/energy-meter.fixtures"
import { delay } from "@/utils/delay"
import React from "react"

type StoredEnergyMeter = {
  propertyId: PropertyId
  meter: EnergyMeter
}

const SERVER_DELAY = 300

export function useEnergyMeterService(): EnergyMeterService {
  const energyMeters = React.useRef<Map<EnergyMeterId, StoredEnergyMeter>>(
    new Map(defaultEnergyMeters.map((entry) => [entry.meter.id, entry]))
  )

  return {
    getEnergyMeter: async ({ EnergyMeterId: energyMeterId }) => {
      await delay(SERVER_DELAY)
      const entry = energyMeters.current.get(energyMeterId)
      if (!entry) throw new Error(`Energy meter ${energyMeterId} not found`)
      return entry.meter
    },
    getEnergyMeters: async ({ propertyId }) => {
      await delay(SERVER_DELAY)
      return Array.from(energyMeters.current.values())
        .filter((entry) => entry.propertyId === propertyId)
        .map((entry) => entry.meter)
    },
    createEnergyMeter: async (input) => {
      await delay(SERVER_DELAY)
      const fields = CreateEnergyMeterInput.parse(input)
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
      energyMeters.current.set(meter.id, {
        propertyId: fields.propertyId,
        meter,
      })
      return meter
    },
  }
}
