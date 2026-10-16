import {
  Property,
  PropertyId,
} from "@/features/portfolio/models/property.models"
import z from "zod"

export interface PropertyService {
  getProperties: () => Promise<Property[]>
  getProperty: (input: GetPropertyInput) => Promise<Property>
  createProperty: (input: CreatePropertyInput) => Promise<Property>
  updateProperty: (input: UpdatePropertyInput) => Promise<Property>
}

export type GetPropertyInput = z.infer<typeof GetPropertyInput>
export const GetPropertyInput = z.object({
  propertyId: PropertyId,
})

export type CreatePropertyInput = z.infer<typeof CreatePropertyInput>
export const CreatePropertyInput = Property.omit({
  id: true,
  createdAt: true,
  energyStarScore: true,
  owner: true,
}).extend({
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
  zip: z.string("Enter the ZIP code").trim().min(1, "Enter the ZIP code"),
})

export type UpdatePropertyInput = z.infer<typeof UpdatePropertyInput>
export const UpdatePropertyInput = CreatePropertyInput.extend({
  propertyId: PropertyId,
})
