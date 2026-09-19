import { BaseEntity } from "@/models/shared.models"
import { User } from "@/features/auth/models/user.models"
import z from "zod"

export type BuildingId = z.infer<typeof BuildingId>
export const BuildingId = z.uuid().brand("BuildingId")

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

export type Building = z.infer<typeof Building>
export const Building = BaseEntity(BuildingId).extend({
  propertyAddress: z.string(),
  buildingSize: z.number(),
  propertyUseType: PropertyType,
  siteEUI: z.number().optional(),
  sourceEUI: z.number().optional(),
  totalGreenhouseEmissions: z.number().optional(),
  energyStarScore: z.number().optional(),
  propertyNotes: z.string().optional(),
  auditStatus: z
    .literal(["PARTICIPATING", "NOT_PARTICIPATING", "APPROVED_FOR_EXEMPTION"])
    .optional(),
  complianceStatus: z.literal([
    "PARTICIPATING",
    "NOT_PARTICIPATING",
    "APPROVED_FOR_EXEMPTION",
  ]),
  owner: User,
})
