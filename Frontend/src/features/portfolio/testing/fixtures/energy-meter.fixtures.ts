import { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import { defaultProperties } from "@/features/portfolio/testing/fixtures/property.fixtures"

export const defaultEnergyMeters: EnergyMeter[] = defaultProperties.map(
  (property, index) =>
    EnergyMeter.parse({
      id: `c0ed477e-df48-4e5a-9c79-${String(index + 1).padStart(12, "0")}`,
      createdAt: property.createdAt,
      propertyId: property.id,
      date: "2025-12-31T00:00:00.000Z",
      meterId: `METER-${String(index + 1).padStart(3, "0")}`,
      meterType: "ELECTRIC_GRID",
      unitOfMeasure: "kBtu",
      inUse: true,
      isDelivered: false,
      meterKBtu: property.energyUse ?? 0,
      rawUse: property.energyUse ?? 0,
      siteEui: property.siteEui ?? 0,
      sourceEui: property.sourceEui ?? 0,
    })
)
