import { BaseEntity } from "@/models/shared.models"
import z from "zod"

export type PropertyId = z.infer<typeof PropertyId>
export const PropertyId = z.uuid().brand("PropertyId")

export type PropertyType = z.infer<typeof PropertyType>
export const PropertyType = z.enum(
  [
    "CONVENIENCE_STORE",
    "DATA_CENTER",
    "HOSPITAL",
    "HOTEL",
    "K12_SCHOOL",
    "MEDICAL_OFFICE",
    "MULTIFAMILY_HOUSING",
    "OFFICE",
    "PARKING",
    "RESIDENCE_HALL",
    "RETAIL_STORE",
    "SENIOR_LIVING",
    "SINGLE_FAMILY_HOMES",
    "SUPERMARKET",
    "SWIMMING_POOL",
    "VEHICLE_DEALERSHIP",
    "WAREHOUSE",
    "WASTEWATER_TREATMENT_PLANT",
    "WORSHIP_FACILITY",
  ] as const,
  "Select a property type"
)

export type Property = z.infer<typeof Property>
export const Property = BaseEntity(PropertyId).extend({
  name: z.string("Enter the name of the property"),
  propertyType: PropertyType,
  streetAddress: z.string("Enter a the property street address"),
  city: z.string("Enter the city the property is located in"),
  state: z.string("Enter the city the property is located in"),
  zip: z.string("Enter the property zip code"),
  notes: z.string().optional(),
  energyStarScore: z.number().optional().default(0),
})
