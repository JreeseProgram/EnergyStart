import { BaseEntity } from "@/models/shared.models"
import z from "zod"

export type PropertyId = z.infer<typeof PropertyId>
export const PropertyId = z.uuid().brand("PropertyId")

export type PropertyType = z.infer<typeof PropertyType>
export const PropertyType = z.enum([
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
])

export type Property = z.infer<typeof Property>
export const Property = BaseEntity(PropertyId).extend({
  name: z.string(),
})
