import { BuildingUse } from "@/features/portfolio/models/building-use.models"
import { Property, type PropertyId } from "@/features/portfolio/models/property.models"
import { defaultBuildingUses } from "@/features/portfolio/testing/fixtures/building-use.fixtures"
import { defaultProperties } from "@/features/portfolio/testing/fixtures/property.fixtures"
import { testPortfolioUser } from "@/features/portfolio/testing/fixtures/user.fixtures"

export function createPortfolioTestStore() {
  return {
    properties: defaultProperties.map((property) =>
      Property.parse({ ...property, owner: testPortfolioUser })
    ),
    buildingUses: new Map(
      defaultBuildingUses.map((use) => [use.id, BuildingUse.parse(use)])
    ),
  }
}
export type PortfolioTestStore = ReturnType<typeof createPortfolioTestStore>

export function requireProperty(
  store: PortfolioTestStore,
  propertyId: PropertyId
) {
  const property = store.properties.find(
    (property) => property.id === propertyId
  )
  if (!property) throw new Error("Property not found")
  return property
}
