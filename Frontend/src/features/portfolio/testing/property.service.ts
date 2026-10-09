import {
  Property,
  PropertyId,
  PropertyType,
} from "@/features/portfolio/models/property.models"
import { type PropertyService } from "@/features/portfolio/services/property.service"
import { delay } from "@/utils/delay"
import React from "react"

const defaultProperties = [
  Property.parse({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: "Lake Eola Offices",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.OFFICE,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 86,
  }),

  Property.parse({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: "Mills 50 Market",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.RETAIL_STORE,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 50,
  }),

  Property.parse({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: "Sunrail Commons",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.MULTIFAMILY_HOUSING,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 91,
  }),

  Property.parse({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: "Cypress Logistics",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.WAREHOUSE,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 24,
  }),
]

export function usePropertyService(): PropertyService {
  const properties = React.useRef<Property[]>(defaultProperties)

  return {
    getProperties: async () => {
      await delay(500)
      return properties.current
    },
    createProperty: async (input) => {
      await delay(500)
      const property = Property.parse({
        id: PropertyId.parse(crypto.randomUUID()),
        createdAt: new Date().toISOString(),
        ...input,
      })
      properties.current = [...properties.current, property]
      return property
    },
  }
}
