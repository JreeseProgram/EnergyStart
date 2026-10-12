import {
  Property,
  PropertyId,
} from "@/features/portfolio/models/property.models"
import z from "zod"

export interface PropertyService {
  getProperties: () => Promise<Property[]>
  getProperty: (input: GetPropertyInput) => Promise<Property>
  createProperty: (input: CreatePropertyInput) => Promise<Property>
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
})
