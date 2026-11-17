import { PropertyId } from "@/features/portfolio/models/property.models"
import z from "zod"

export type EnergyMeterId = z.infer<typeof EnergyMeterId>
export const EnergyMeterId = z.string().min(1).brand("EnergyMeterId")

export type EnergyMeterType = z.infer<typeof EnergyMeterType>
export const EnergyMeterType = z.enum(
  [
    "ELECTRIC_GRID",
    "ELECTRIC_SOLAR",
    "ELECTRIC_WIND",
    "FUEL_OIL_1",
    "FUEL_OIL_2",
    "FUEL_OIL_4",
    "FUEL_OIL_5_AND_6",
    "NATURAL_GAS",
    "PROPANE",
    "DIESEL",
    "DISTRICT_STEAM",
    "DISTRICT_HOT_WATER",
    "DISTRICT_CHILLED_WATER",
    "COAL_ANTHRACITE",
    "COAL_BITUMINOUS",
    "COKE",
    "WOOD",
    "KEROSENE",
  ] as const,
  "Select a meter type type"
)

export type UnitOfMeasure = z.infer<typeof UnitOfMeasure>
export const UnitOfMeasure = z.enum(
  [
    "kWh", //Thousand wh
    "MWh", //Million wh
    "kBtu", //Thousand Btu
    "MBtu", //Million Btu
    "GJ",
    "cf", //cubic feet
    "Ccf", //hundred cubic feet
    "Kcf", //thousand cubic feet
    "Mcf", //million cubic feet
    "Therms",
    "cubic_meters",
    "US_Gallons",
    "UK_Gallons",
    "Liters",
    "Lbs",
    "kLbs", //Thousand Pounds
    "MLbs", //Million Pounds
    "kg",
    "Ton_Hours",
    "Tons", //Imperial Ton
    "Tonnes", //Metric Ton
  ] as const,
  "Select a meter type type"
)

export const EnergyReadingMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Select a valid month")

// Response validation follows the DTO, independently of write constraints.
export type EnergyReading = z.infer<typeof EnergyReading>
export const EnergyReading = z.object({
  id: z.string().min(1),
  date: EnergyReadingMonth,
  usage: z.number(),
  cost: z.number(),
  createdAt: z.iso.datetime({ local: true }),
})

export const EnergyReadingFields = z.object({
  date: EnergyReadingMonth.refine(
    (date) => date <= new Date().toISOString().slice(0, 7),
    "Readings cannot be in the future"
  ),
  usage: z.number().nonnegative("Usage must be zero or greater"),
  cost: z.number().nonnegative("Cost must be zero or greater"),
})

export type EnergyMeter = z.infer<typeof EnergyMeter>
export const EnergyMeter = z.object({
  meterId: EnergyMeterId,
  propertyId: PropertyId,
  meterName: z.string().nullable(),
  readings: z.array(EnergyReading),
  meterType: EnergyMeterType,
  unitOfMeasure: UnitOfMeasure,
  inUse: z.boolean(),
  isDelivered: z.boolean(),
})
