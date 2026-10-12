import { User } from "@/features/portfolio/models/user.models"
import { BaseEntity } from "@/models/shared.models"
import z from "zod"

export type PropertyId = z.infer<typeof PropertyId>
export const PropertyId = z.uuid().brand("PropertyId")

export type PropertyType = z.infer<typeof PropertyType>
export const PropertyType = z.enum(
  [
    "BANK_BRANCH",
    "CONVENIENCE_STORE",
    "COURT_HOUSE",
    "DATA_CENTER",
    "DISTRIBUTION_CENTER",
    "FINANCIAL_OFFICE",
    "HOSPITAL",
    "HOTEL",
    "MEDICAL_OFFICE",
    "MULTIFAMILY_HOUSING",
    "OFFICE",
    "RETAIL_STORE",
    "SCHOOL",
    "SENIOR_LIVING",
    "SUPERMARKET",
    "VEHICLE_DEALERSHIP",
    "WAREHOUSE_REFRIGERATED",
    "WAREHOUSE",
    "WHOLESALE_CLUB",
    "WORSHIP_FACILITY",
  ] as const,
  "Select a property type"
)

export type Property = z.infer<typeof Property>
export const Property = BaseEntity(PropertyId).extend({
  humanReadablePropertyId: z.string().optional(),
  city: z.string("Enter the city the property is located in"),
  energyStarScore: z.number().optional().default(0),
  name: z.string("Enter the name of the property"),
  notes: z.string().optional(),
  owner: User,
  propertyType: PropertyType,
  state: z.string("Enter the city the property is located in"),
  streetAddress: z.string("Enter a the property street address"),
  zip: z.string("Enter the property zip code"),
})
