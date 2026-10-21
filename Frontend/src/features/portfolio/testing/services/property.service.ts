import { useState } from "react"
import z from "zod"
import { delay } from "@/utils/delay"
import { Property, PropertyType } from "../../models/property.models"
import {
  CreatePropertyInput,
  UpdatePropertyInput,
  type PropertyService,
} from "../../services/property.service"
import { testUser } from "@/features/auth/testing/services/auth.service"

export const defaultProperties = z.array(Property).parse([
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
    grossFloorArea: 125000,
    owner: testUser,
    reportingYear: "2025",
    auditComplianceStatus: "NOT_PARTICIPATING",
    energyUse: 6875000,
    siteEui: 55,
    sourceEui: 121,
    annualGHG: 420,
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
    grossFloorArea: 33000,
    owner: testUser,
    reportingYear: "2025",
    auditComplianceStatus: "NOT_PARTICIPATING",
    energyUse: 2720000,
    siteEui: 85,
    sourceEui: 187,
    annualGHG: 180,
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
    grossFloorArea: 98000,
    owner: testUser,
    reportingYear: "2025",
    auditComplianceStatus: "NOT_PARTICIPATING",
    energyUse: 3920000,
    siteEui: 40,
    sourceEui: 88,
    annualGHG: 240,
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
    grossFloorArea: 0,
    owner: testUser,
    reportingYear: "2025",
    auditComplianceStatus: "NOT_PARTICIPATING",
  },
])

const SERVER_DELAY = 300

export function usePropertyTestService(): PropertyService {
  const [properties] = useState(
    () =>
      new Map(
        defaultProperties.map((property) => [
          property.id,
          Property.parse(property),
        ])
      )
  )
  return {
    getProperties: async () => {
      await delay(SERVER_DELAY)
      return Array.from(properties.values()).map((property) =>
        Property.parse(property)
      )
    },
    getProperty: async ({ propertyId }) => {
      await delay(SERVER_DELAY)
      const property = properties.get(propertyId)
      if (!property) throw new Error(`Property ${propertyId} not found`)
      return Property.parse(property)
    },
    createProperty: async (input) => {
      await delay(SERVER_DELAY)
      const property = Property.parse({
        ...CreatePropertyInput.parse(input),
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        owner: testUser,
        reportingYear: String(new Date().getFullYear()),
        auditComplianceStatus: "NOT_PARTICIPATING",
        grossFloorArea: 0,
      })
      properties.set(property.id, property)
      return Property.parse(property)
    },
    updateProperty: async (input) => {
      await delay(SERVER_DELAY)
      const { propertyId, ...fields } = UpdatePropertyInput.parse(input)
      const existing = properties.get(propertyId)
      if (!existing) throw new Error(`Property ${propertyId} not found`)
      const property = Property.parse({
        ...existing,
        ...fields,
      })
      properties.set(property.id, property)
      return Property.parse(property)
    },
  }
}
