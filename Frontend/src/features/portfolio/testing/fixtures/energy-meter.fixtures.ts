import { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import { defaultProperties } from "@/features/portfolio/testing/fixtures/property.fixtures"

export const defaultEnergyMeters: EnergyMeter[] = defaultProperties.map(
  (property, index) =>
    EnergyMeter.parse({
      meterId: `c0ed477e-df48-4e5a-9c79-${String(index + 1).padStart(12, "0")}`,
      propertyId: property.id,
      meterName: `METER-${String(index + 1).padStart(3, "0")}`,
      meterType: "ELECTRIC_GRID",
      unitOfMeasure: "kBtu",
      readings: [],
      inUse: true,
      isDelivered: false,
    })
)
