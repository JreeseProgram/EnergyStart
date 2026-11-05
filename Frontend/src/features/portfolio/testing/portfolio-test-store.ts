import { BuildingUse } from "@/features/portfolio/models/building-use.models"
import {
  Property,
  type PropertyId,
} from "@/features/portfolio/models/property.models"
import { defaultBuildingUses } from "@/features/portfolio/testing/fixtures/building-use.fixtures"
import { defaultProperties } from "@/features/portfolio/testing/fixtures/property.fixtures"
import { User } from "@/features/portfolio/models/user.models"
import {
  mockSharingUsers,
  testPortfolioUser,
} from "@/features/portfolio/testing/fixtures/user.fixtures"

export function createPortfolioTestStore(owner: User = testPortfolioUser) {
  return {
    users: [
      owner,
      ...mockSharingUsers.filter(
        (user) =>
          user.id !== owner.id &&
          user.email.toLowerCase() !== owner.email.toLowerCase()
      ),
    ],
    properties: defaultProperties.map((property, index) =>
      Property.parse({
        ...property,
        owner,
        assignments:
          index === 0 &&
          owner.id !== mockSharingUsers[0].id &&
          owner.email.toLowerCase() !== mockSharingUsers[0].email.toLowerCase()
            ? [
                {
                  user: mockSharingUsers[0],
                  assignedAt: "2026-09-18T12:00:00.000Z",
                },
              ]
            : [],
      })
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
