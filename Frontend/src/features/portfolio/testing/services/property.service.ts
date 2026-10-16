import { testUser } from "@/features/auth/testing/services/auth.service"
import {
  Property,
  PropertyId,
  PropertyType,
} from "@/features/portfolio/models/property.models"
import {
  type PropertyService,
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@/features/portfolio/services/property.service"
import { delay } from "@/utils/delay"
import React from "react"
import z from "zod"

export const defaultProperties = [
  {
    id: "a0ed477e-df48-4e5a-9c79-2323c5df5301",
    createdAt: new Date().toISOString(),
    name: "Lake Eola Offices",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.OFFICE,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 86,
  },

  {
    id: "a0ed477e-df48-4e5a-9c79-2323c5df5302",
    createdAt: new Date().toISOString(),
    name: "Mills 50 Market",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.RETAIL_STORE,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 50,
  },

  {
    id: "a0ed477e-df48-4e5a-9c79-2323c5df5303",
    createdAt: new Date().toISOString(),
    name: "Sunrail Commons",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.MULTIFAMILY_HOUSING,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 91,
  },

  {
    id: "a0ed477e-df48-4e5a-9c79-2323c5df5304",
    createdAt: new Date().toISOString(),
    name: "Cypress Logistics",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.WAREHOUSE,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 24,
  },
]

const SERVER_DELAY = 300

export function usePropertyService(): PropertyService {
  const properties = React.useRef<Property[]>(
    z.array(Property).parse(
      defaultProperties.map((prop) => ({
        ...prop,
        owner: testUser,
      }))
    )
  )

  return {
    getProperties: async () => {
      await delay(SERVER_DELAY)
      return properties.current
    },
    getProperty: async ({ propertyId }) => {
      await delay(SERVER_DELAY)
      const property = properties.current.find(
        (property) => property.id === propertyId
      )
      if (!property) throw new Error(`Building ${propertyId} not found`)
      return property
    },
    updateProperty: async (input) => {
      const { propertyId, ...fields } = UpdatePropertyInput.parse(input)
      await delay(SERVER_DELAY)
      const existing = properties.current.find(
        (property) => property.id === propertyId
      )
      if (!existing) throw new Error(`Property ${propertyId} not found`)
      const updated = Property.parse({ ...existing, ...fields })
      properties.current = properties.current.map((property) =>
        property.id === propertyId ? updated : property
      )
      return updated
    },
    createProperty: async (input) => {
      const fields = CreatePropertyInput.parse(input)
      await delay(SERVER_DELAY)
      const property = Property.parse({
        id: PropertyId.parse(crypto.randomUUID()),
        createdAt: new Date().toISOString(),
        owner: testUser,
        ...fields,
      })
      properties.current = [...properties.current, property]
      return property
    },
  }
}
