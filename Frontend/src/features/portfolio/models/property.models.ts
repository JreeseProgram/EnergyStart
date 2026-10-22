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

export type AuditComplianceStatus = z.infer<typeof AuditComplianceStatus>
export const AuditComplianceStatus = z.enum([
  "PARTICIPATING",
  "NOT_PARTICIPATING",
  "APPROVED_FOR_EXEMPTION",
] as const)

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
  auditComplianceStatus:
    AuditComplianceStatus.optional().default("NOT_PARTICIPATING"),
  reportingYear: z.string(),
  siteEui: z.number().optional(),
  sourceEui: z.number().optional(),
  annualGHG: z.number().optional(), // Annual Greenhouse Gas Emissions
  energyUse: z.number().optional(),
  // Read-only summary supplied by the service/backend, never a metadata input.
  grossFloorArea: z.number().nonnegative(),
})
