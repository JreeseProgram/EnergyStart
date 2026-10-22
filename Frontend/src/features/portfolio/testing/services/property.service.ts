import {
  Property,
  PropertyId,
} from "@/features/portfolio/models/property.models"
import {
  type PropertyService,
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@/features/portfolio/services/property.service"
import { defaultProperties } from "@/features/portfolio/testing/fixtures/property.fixtures"
import { testPortfolioUser } from "@/features/portfolio/testing/fixtures/user.fixtures"
import { delay } from "@/utils/delay"
import React from "react"
import z from "zod"

const SERVER_DELAY = 300

export function usePropertyService(): PropertyService {
  const properties = React.useRef<Property[]>(
    z.array(Property).parse(
      defaultProperties.map((prop) => ({
        ...prop,
        owner: testPortfolioUser,
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
      return property ?? null
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
        owner: testPortfolioUser,
        ...fields,
      })
      properties.current = [...properties.current, property]
      return property
    },
  }
}
