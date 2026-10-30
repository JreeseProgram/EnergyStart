import { PropertyId } from "@/features/portfolio/models/property.models"
import { BaseEntity } from "@/models/shared.models"
import z from "zod"

export type EnergyMeterId = z.infer<typeof EnergyMeterId>
export const EnergyMeterId = z.uuid().brand("EnergyMeterId")

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

export const EnergyReadingFields = z
  .object({
    startDate: z.iso.date("Enter a valid start date"),
    endDate: z.iso.date("Enter a valid end date"),
    usage: z.number().nonnegative("Usage must be zero or greater"),
    cost: z.number().nonnegative("Cost must be zero or greater").optional(),
  })
  .refine((reading) => reading.startDate <= reading.endDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  })
  .refine(
    (reading) => reading.endDate <= new Date().toISOString().slice(0, 10),
    {
      message: "Readings cannot end in the future",
      path: ["endDate"],
    }
  )
export const EnergyReading = EnergyReadingFields.safeExtend({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
})
export type EnergyReading = z.infer<typeof EnergyReading>

export type EnergyMeter = z.infer<typeof EnergyMeter>
export const EnergyMeter = BaseEntity(EnergyMeterId).extend({
  propertyId: PropertyId,
  updatedAt: z.iso.datetime().optional(),
  readings: z.array(EnergyReading).default([]),
  date: z.iso.datetime().optional().default(new Date().toISOString()),
  meterId: z.string().optional(),
  meterType: EnergyMeterType,
  unitOfMeasure: UnitOfMeasure,
  inUse: z.boolean(),
  isDelivered: z.boolean(),
  meterKBtu: z.number(),
  rawUse: z.number(),
  siteEui: z.number(),
  sourceEui: z.number(),
})
