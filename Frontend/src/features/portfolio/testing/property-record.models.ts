import z from "zod"
import { User } from "@/features/portfolio/models/user.models"
import {
  PropertyId,
  PropertyType,
} from "@/features/portfolio/models/property.models"

// Internal test-store data; service consumers receive the canonical Property DTO.
export type AuditComplianceStatus = z.infer<typeof AuditComplianceStatus>
export const AuditComplianceStatus = z.enum([
  "PARTICIPATING",
  "NOT_PARTICIPATING",
  "APPROVED_FOR_EXEMPTION",
] as const)

export const PropertyAssignment = z.object({
  user: User,
  assignedAt: z.iso.datetime(),
})
export type PropertyAssignment = z.infer<typeof PropertyAssignment>

export type TestPropertyRecord = z.infer<typeof TestPropertyRecord>
export const TestPropertyRecord = z.object({
  id: PropertyId,
  createdAt: z.iso
    .datetime()
    .optional()
    .default(() => new Date().toISOString()),
  humanReadablePropertyId: z.string().optional(),
  city: z.string("Enter the city the property is located in"),
  energyStarScore: z.number().optional().default(0),
  name: z.string("Enter the name of the property"),
  notes: z.string().optional(),
  owner: User,
  // Read-only snapshot; sharing changes use dedicated service operations.
  assignments: z.array(PropertyAssignment).default([]),
  propertyType: z.union([PropertyType, z.literal("None")]),
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
