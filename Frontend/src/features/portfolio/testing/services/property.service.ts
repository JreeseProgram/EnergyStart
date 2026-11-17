import type { PortfolioTestStore } from "@/features/portfolio/testing/portfolio-test-store"
import { Property } from "@/features/portfolio/models/property.models"
import {
  type PropertyService,
  CreatePropertyInput,
  UpdatePropertyInput,
  GetPropertyInput,
  AddPropertyUserInput,
  RemovePropertyUserInput,
  PropertyUser,
} from "@/features/portfolio/services/property.service"
import { User } from "@/features/portfolio/models/user.models"
import { TestPropertyRecord } from "@/features/portfolio/testing/property-record.models"
import { delay } from "@/utils/delay"

const SERVER_DELAY = 300

export function createPropertyTestService(
  store: PortfolioTestStore,
  getCurrentUser: () => Promise<User | null>
): PropertyService {
  // Initialize legacy fixtures once; ownership is not an access privilege.
  for (const property of store.properties) {
    property.authorizedUserIds ??= [
      property.owner.id,
      ...property.assignments.map(({ user }) => user.id),
    ]
  }
  const authorizedIds = (property: TestPropertyRecord) =>
    property.authorizedUserIds ?? []

  const withFloorArea = (property: TestPropertyRecord): TestPropertyRecord =>
    TestPropertyRecord.parse({
      ...property,
      grossFloorArea: Array.from(store.buildingUses.values())
        .filter((use) => use.propertyId === property.id)
        .reduce((sum, use) => sum + use.grossFloorArea, 0),
    })

  const toProperty = (property: TestPropertyRecord): Property => {
    const item = withFloorArea(property)
    return Property.parse({
      ...item,
      humanReadablePropertyId: item.humanReadablePropertyId ?? null,
      notes: item.notes ?? null,
      authUsers: authorizedIds(item),
      siteEui: item.siteEui ?? 0,
      sourceEui: item.sourceEui ?? 0,
      energyUse: item.energyUse ?? 0,
    })
  }

  const canAccess = (user: User, property: TestPropertyRecord) =>
    authorizedIds(property).includes(user.id)

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

  const save = (property: TestPropertyRecord) => {
    const validated = withFloorArea(property)

    store.properties = store.properties.map((existing) =>
      existing.id === validated.id ? validated : existing
    )

    return toProperty(validated)
  }

  return {
    getPropertyUsers: async (input) => {
      const { propertyId } = GetPropertyInput.parse(input)
      await delay(SERVER_DELAY)
      const actor = await requireUser()
      const property = requireProperty(propertyId)
      if (!canAccess(actor, property))
        throw new Error("You do not have access to this property.")
      return authorizedIds(property).map((id) => {
        const user = store.users.find((user) => user.id === id)
        if (!user) throw new Error("User not found.")
        return PropertyUser.parse({
          userId: user.id,
          email: user.email,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
        })
      })
    },
    removePropertyUser: async (input) => {
      const { propertyId, userId } = RemovePropertyUserInput.parse(input)
      await delay(SERVER_DELAY)
      const actor = await requireUser()
      const property = requireProperty(propertyId)
      if (!canAccess(actor, property))
        throw new Error("You do not have access to this property.")
      const ids = authorizedIds(property)
      if (!ids.includes(userId))
        throw new Error("User is not assigned to this property.")
      if (ids.length <= 1)
        throw new Error(
          "Cannot remove the last authorized user from a property."
        )
      save({
        ...property,
        authorizedUserIds: ids.filter((id) => id !== userId),
      })
    },
    addPropertyUser: async (input) => {
      const { propertyId, email } = AddPropertyUserInput.parse(input)
      await delay(SERVER_DELAY)
      const actor = await requireUser()
      const property = requireProperty(propertyId)

      if (!canAccess(actor, property)) {
        throw new Error("You do not have access to this property.")
      }

      const user = store.users.find(
        (user) => user.email.trim().toLowerCase() === email
      )

      if (!user) {
        throw new Error("No registered user has this email address.")
      }

      const hasAccess = authorizedIds(property).includes(user.id)

      if (hasAccess) {
        throw new Error("This user already has access.")
      }

      save({
        ...property,
        authorizedUserIds: [...authorizedIds(property), user.id],
      })
    },
    getProperties: async () => {
      await delay(SERVER_DELAY)

      const user = await requireUser()

      return store.properties
        .filter((property) => canAccess(user, property))
        .map(toProperty)
    },

    getProperty: async (input) => {
      const { propertyId } = GetPropertyInput.parse(input)

      await delay(SERVER_DELAY)

      const property = store.properties.find(
        (property) => property.id === propertyId
      )

      const actor = await requireUser()
      if (property && !canAccess(actor, property))
        throw new Error("You do not have access to this property.")
      return property ? toProperty(property) : null
    },

    updateProperty: async (input) => {
      const { propertyId, ...fields } = UpdatePropertyInput.parse(input)

      await delay(SERVER_DELAY)

      const actor = await requireUser()

      const existing = store.properties.find(
        (property) => property.id === propertyId
      )

      if (!existing) {
        throw new Error("Property not found.")
      }

      if (!canAccess(actor, existing)) {
        throw new Error("You do not have access to edit this property.")
      }

      return save({
        ...existing,
        ...fields,
        notes:
          fields.notes === undefined
            ? existing.notes
            : fields.notes.trim() === ""
              ? ""
              : fields.notes,
        humanReadablePropertyId:
          fields.humanReadablePropertyId === undefined
            ? existing.humanReadablePropertyId
            : fields.humanReadablePropertyId === ""
              ? undefined
              : fields.humanReadablePropertyId,
      })
    },

    createProperty: async (input) => {
      await delay(SERVER_DELAY)

      const actor = await requireUser()
      const property = TestPropertyRecord.parse({
        ...CreatePropertyInput.parse(input),
        propertyType: "None",
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        owner: actor,
        authorizedUserIds: [actor.id],
        reportingYear: String(new Date().getFullYear()),
        auditComplianceStatus: "NOT_PARTICIPATING",
        grossFloorArea: 0,
      })

      store.properties = [...store.properties, property]

      return toProperty(property)
    },
  }
}
