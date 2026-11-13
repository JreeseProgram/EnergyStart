import z from "zod"

export type PropertyId = z.infer<typeof PropertyId>
export const PropertyId = z.string().min(1).brand("PropertyId")

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

// Matches FrontendLinkingDTO.Property for list and API detail responses.
export const Property = z.object({
  id: PropertyId,
  humanReadablePropertyId: z.string().nullable(),
  city: z.string().nullable(),
  energyStarScore: z.number().int(),
  name: z.string().nullable(),
  notes: z.string().nullable(),
  authUsers: z.array(z.string()),
  propertyType: z.union([PropertyType, z.literal("None")]),
  state: z.string().nullable(),
  streetAddress: z.string().nullable(),
  zip: z.string().nullable(),
  reportingYear: z.string().nullable(),
  siteEui: z.number(),
  sourceEui: z.number(),
  energyUse: z.number(),
  grossFloorArea: z.number().int(),
})
export type Property = z.infer<typeof Property>
