import { Property } from "@/features/portfolio/models/property.models"
import type z from "zod"

export interface PropertyService {
  getProperties: () => Promise<Property[]>
  createProperty: (input: CreatePropertyInput) => Promise<Property>
}

export type CreatePropertyInput = z.infer<typeof CreatePropertyInput>
export const CreatePropertyInput = Property.omit({
  id: true,
  createdAt: true,
  energyStarScore: true,
})
