import {
  type Property,
  PropertyId,
} from "@/features/portfolio/models/property.models"
import z from "zod"

export interface PropertyService {
  addPropertyUser: (input: AddPropertyUserInput) => Promise<void>
  getProperties: () => Promise<Property[]>
  getProperty: (input: GetPropertyInput) => Promise<Property | null>
  createProperty: (input: CreatePropertyInput) => Promise<Property>
  updateProperty: (input: UpdatePropertyInput) => Promise<Property>
}

export type GetPropertyInput = z.infer<typeof GetPropertyInput>
export const GetPropertyInput = z.object({
  propertyId: PropertyId,
})

const IntegerText = z
  .string()
  .trim()
  .regex(/^\d+$/, "Enter a whole number using digits only")
  .refine((value) => Number(value) <= 2147483647, "Must be at most 2147483647")

export type CreatePropertyInput = z.infer<typeof CreatePropertyInput>
export const CreatePropertyInput = z.object({
  notes: z.string().optional(),
  humanReadablePropertyId: z
    .union([IntegerText, z.string().trim().length(0)])
    .optional(),
  name: z
    .string("Enter the property name")
    .trim()
    .min(1, "Enter the property name"),
  streetAddress: z
    .string("Enter the street address")
    .trim()
    .min(1, "Enter the street address"),
  city: z.string("Enter the city").trim().min(1, "Enter the city"),
  state: z.string("Select a state").trim().min(1, "Select a state"),
  zip: IntegerText,
})

export type UpdatePropertyInput = z.infer<typeof UpdatePropertyInput>
export const UpdatePropertyInput = CreatePropertyInput.extend({
  propertyId: PropertyId,
})

// The POST succeeded even if its response or refreshed details are unusable.
export class PropertyCreateRefreshError extends Error {
  readonly propertyId: PropertyId | undefined

  constructor(propertyId: PropertyId | undefined, cause: unknown) {
    super(
      "Property created, but its details could not be loaded. Close this form and reload the property list; do not create it again.",
      { cause }
    )
    this.name = "PropertyCreateRefreshError"
    this.propertyId = propertyId
  }
}

// A successful PUT must never be mistaken for a failed save or retried.
export class PropertyUpdateRefreshError extends Error {
  readonly propertyId: PropertyId

  constructor(propertyId: PropertyId, cause: unknown) {
    super(
      "Property saved, but refreshed details could not be loaded. Close this form and reload the property; do not save again.",
      { cause }
    )
    this.name = "PropertyUpdateRefreshError"
    this.propertyId = propertyId
  }
}

// POST succeeded; unusable response data must not invite another share request.
export class PropertyShareRefreshError extends Error {
  readonly propertyId: PropertyId

  constructor(propertyId: PropertyId, cause: unknown) {
    super(
      "Property access added, but the response could not be validated. Close this form and reload the property; do not add this user again.",
      { cause }
    )
    this.name = "PropertyShareRefreshError"
    this.propertyId = propertyId
  }
}

export type AddPropertyUserInput = z.infer<typeof AddPropertyUserInput>
export const AddPropertyUserInput = z.object({
  propertyId: PropertyId,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address")),
})
