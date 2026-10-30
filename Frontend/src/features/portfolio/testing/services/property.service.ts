import type { PortfolioTestStore } from "@/features/portfolio/testing/portfolio-test-store"
import { Property } from "@/features/portfolio/models/property.models"
import {
  type PropertyService,
  CreatePropertyInput,
  UpdatePropertyInput,
} from "@/features/portfolio/services/property.service"
import { testPortfolioUser } from "@/features/portfolio/testing/fixtures/user.fixtures"
import { delay } from "@/utils/delay"

const SERVER_DELAY = 300

export function createPropertyTestService(
  store: PortfolioTestStore
): PropertyService {
  const withFloorArea = (property: Property): Property =>
    Property.parse({
      ...property,
      grossFloorArea: Array.from(store.buildingUses.values())
        .filter((use) => use.propertyId === property.id)
        .reduce((sum, use) => sum + use.grossFloorArea, 0),
    })
  return {
    getProperties: async () => {
      await delay(SERVER_DELAY)
      return store.properties.map((property) => withFloorArea(property))
    },
    getProperty: async ({ propertyId }) => {
      await delay(SERVER_DELAY)
      const property = store.properties.find(
        (property) => property.id === propertyId
      )
      return property ? withFloorArea(property) : null
    },
    updateProperty: async (input) => {
      const { propertyId, ...fields } = UpdatePropertyInput.parse(input)
      await delay(SERVER_DELAY)
      const existing = store.properties.find(
        (property) => property.id === propertyId
      )
      if (!existing) throw new Error(`Property ${propertyId} not found`)
      const updated = Property.parse({ ...existing, ...fields })
      store.properties = store.properties.map((property) =>
        property.id === propertyId ? updated : property
      )
      return withFloorArea(updated)
    },
    createProperty: async (input) => {
      await delay(SERVER_DELAY)
      const property = Property.parse({
        ...CreatePropertyInput.parse(input),
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        owner: testPortfolioUser,
        reportingYear: String(new Date().getFullYear()),
        auditComplianceStatus: "NOT_PARTICIPATING",
        grossFloorArea: 0,
      })
      store.properties = [...store.properties, property]
      return Property.parse(property)
    },
  }
}
