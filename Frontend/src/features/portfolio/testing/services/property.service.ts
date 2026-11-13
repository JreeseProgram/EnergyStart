import type { PortfolioTestStore } from "@/features/portfolio/testing/portfolio-test-store"
import { Property } from "@/features/portfolio/models/property.models"
import {
  type PropertyService,
  CreatePropertyInput,
  UpdatePropertyInput,
  GetPropertyInput,
  AddPropertyUserInput,
} from "@/features/portfolio/services/property.service"
import { User } from "@/features/portfolio/models/user.models"
import { TestPropertyRecord } from "@/features/portfolio/testing/property-record.models"
import { delay } from "@/utils/delay"

const SERVER_DELAY = 300

export function createPropertyTestService(
  store: PortfolioTestStore,
  getCurrentUser: () => Promise<User | null>
): PropertyService {
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
      authUsers: [
        item.owner.id,
        ...item.assignments.map(({ user }) => user.id),
      ],
      siteEui: item.siteEui ?? 0,
      sourceEui: item.sourceEui ?? 0,
      energyUse: item.energyUse ?? 0,
    })
  }

  const canAccess = (user: User, property: TestPropertyRecord) =>
    property.owner.id === user.id ||
    property.assignments.some(({ user: assignee }) => assignee.id === user.id)

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
    addPropertyUser: async (input) => {
      const { propertyId, email } = AddPropertyUserInput.parse(input)
      await delay(SERVER_DELAY)
      const actor = await requireUser()
      const property = requireProperty(propertyId)

      if (property.owner.id !== actor.id) {
        throw new Error("Only the owner can manage sharing.")
      }

      if (property.owner.email.trim().toLowerCase() === email) {
        throw new Error("The owner already has access.")
      }

      const user = store.users.find(
        (user) => user.email.trim().toLowerCase() === email
      )

      if (!user) {
        throw new Error("No registered user has this email address.")
      }

      const hasAccess = property.assignments.some(
        (assignment) => assignment.user.id === user.id
      )

      if (hasAccess) {
        throw new Error("This user already has access.")
      }

      save({
        ...property,
        assignments: [
          ...property.assignments,
          { user, assignedAt: new Date().toISOString() },
        ],
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

      const property = TestPropertyRecord.parse({
        ...CreatePropertyInput.parse(input),
        propertyType: "None",
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        owner: await requireUser(),
        reportingYear: String(new Date().getFullYear()),
        auditComplianceStatus: "NOT_PARTICIPATING",
        grossFloorArea: 0,
      })

      store.properties = [...store.properties, property]

      return toProperty(property)
    },
  }
}
