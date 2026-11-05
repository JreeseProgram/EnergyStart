import type { PortfolioTestStore } from "@/features/portfolio/testing/portfolio-test-store"
import { Property } from "@/features/portfolio/models/property.models"
import {
  type PropertyService,
  CreatePropertyInput,
  UpdatePropertyInput,
  GetPropertyInput,
  AddPropertyUserInput,
  RemovePropertyUserInput,
} from "@/features/portfolio/services/property.service"
import { User } from "@/features/portfolio/models/user.models"
import { PORTFOLIO_POLICIES } from "@/features/portfolio/utils/portfolio-policies"
import { delay } from "@/utils/delay"

const SERVER_DELAY = 300

export function createPropertyTestService(
  store: PortfolioTestStore,
  getCurrentUser: () => Promise<User | null>
): PropertyService {
  const withFloorArea = (property: Property): Property =>
    Property.parse({
      ...property,
      grossFloorArea: Array.from(store.buildingUses.values())
        .filter((use) => use.propertyId === property.id)
        .reduce((sum, use) => sum + use.grossFloorArea, 0),
    })
  const requireUser = async () => {
    const user = await getCurrentUser()
    if (!user) throw new Error("Sign in to access properties.")
    return User.parse(user)
  }
  const requireProperty = (propertyId: string) => {
    const property = store.properties.find(
      (property) => property.id === propertyId
    )
    if (!property) throw new Error("Property not found.")
    return property
  }
  const save = (property: Property) => {
    const validated = withFloorArea(property)
    store.properties = store.properties.map((existing) =>
      existing.id === validated.id ? validated : existing
    )
    return Property.parse(validated)
  }
  return {
    addPropertyUser: async (input) => {
      const { propertyId, email } = AddPropertyUserInput.parse(input)
      await delay(SERVER_DELAY)
      const actor = await requireUser()
      const property = requireProperty(propertyId)
      if (!PORTFOLIO_POLICIES["property:manage-sharing"](actor, property))
        throw new Error("Only the owner can manage sharing.")
      if (property.owner.email.trim().toLowerCase() === email)
        throw new Error("The owner already has access.")
      const user = store.users.find(
        (user) => user.email.trim().toLowerCase() === email
      )
      if (!user)
        throw new Error("No registered user has this email address.")
      if (
        property.assignments.some(
          (assignment) => assignment.user.id === user.id
        )
      )
        throw new Error("This user already has access.")
      return save({
        ...property,
        assignments: [
          ...property.assignments,
          { user, assignedAt: new Date().toISOString() },
        ],
      })
    },
    removePropertyUser: async (input) => {
      const { propertyId, userId } = RemovePropertyUserInput.parse(input)
      await delay(SERVER_DELAY)
      const actor = await requireUser()
      const property = requireProperty(propertyId)
      if (!PORTFOLIO_POLICIES["property:manage-sharing"](actor, property))
        throw new Error("Only the owner can manage sharing.")
      if (property.owner.id === userId)
        throw new Error("The owner's access cannot be removed.")
      if (
        !property.assignments.some(
          (assignment) => assignment.user.id === userId
        )
      )
        throw new Error("This user no longer has access.")
      return save({
        ...property,
        assignments: property.assignments.filter(
          (assignment) => assignment.user.id !== userId
        ),
      })
    },
    getProperties: async () => {
      await delay(SERVER_DELAY)
      const user = await requireUser()
      return store.properties
        .filter((property) =>
          PORTFOLIO_POLICIES["property:view"](user, property)
        )
        .map(withFloorArea)
    },
    getProperty: async (input) => {
      const { propertyId } = GetPropertyInput.parse(input)
      await delay(SERVER_DELAY)
      const property = store.properties.find(
        (property) => property.id === propertyId
      )
      return property ? withFloorArea(property) : null
    },
    updateProperty: async (input) => {
      const { propertyId, ...fields } = UpdatePropertyInput.parse(input)
      await delay(SERVER_DELAY)
      const actor = await requireUser()
      const existing = store.properties.find(
        (property) => property.id === propertyId
      )
      if (!existing) throw new Error("Property not found.")
      if (!PORTFOLIO_POLICIES["property:edit"](actor, existing))
        throw new Error("You do not have access to edit this property.")
      return save({ ...existing, ...fields })
    },
    createProperty: async (input) => {
      await delay(SERVER_DELAY)
      const property = Property.parse({
        ...CreatePropertyInput.parse(input),
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        owner: await requireUser(),
        reportingYear: String(new Date().getFullYear()),
        auditComplianceStatus: "NOT_PARTICIPATING",
        grossFloorArea: 0,
      })
      store.properties = [...store.properties, property]
      return Property.parse(property)
    },
  }
}
