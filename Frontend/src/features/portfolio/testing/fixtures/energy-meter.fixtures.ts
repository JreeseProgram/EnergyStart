import { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { defaultBuildings } from "@/features/portfolio/testing/fixtures/building.fixtures"

export type StoredEnergyMeter = {
  propertyId: PropertyId
  meter: EnergyMeter
}

export const defaultEnergyMeters: StoredEnergyMeter[] = defaultBuildings.map(
  (building, index) => ({
    propertyId: building.parentProperty.id,
    meter: EnergyMeter.parse({
      id: `c0ed477e-df48-4e5a-9c79-${String(index + 1).padStart(12, "0")}`,
      createdAt: building.createdAt,
      buildingId: building.id,
      date: "2025-12-31T00:00:00.000Z",
      meterId: `METER-${String(index + 1).padStart(3, "0")}`,
      meterType: "ELECTRIC_GRID",
      unitOfMeasure: "kBtu",
      inUse: true,
      isDelivered: false,
      meterKBtu: building.energyUse ?? 0,
      rawUse: building.energyUse ?? 0,
      siteEui: building.siteEui ?? 0,
      sourceEui: building.sourceEui ?? 0,
    }),
  })
)
